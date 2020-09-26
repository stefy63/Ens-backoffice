import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/it';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { Services } from '../../../../../enums/ticket-services.enum';
import {DayOfWeek} from '../../../../../enums/day-of-week.enum';
import { ApiCalendarService } from '../../../../services/api/api-calendar.service';
import { ICalendar } from '../../../../../interfaces/i-calendar';
import * as moment from 'moment';
import { tap, map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { ErrorMessageTranslatorService } from '../../../../services/error-message-translator.service';



@Component({
  selector: 'fuse-schedule-tab',
  templateUrl: './schedule-tab.component.html',
  styleUrls: ['./schedule-tab.component.scss'],
})
export class ScheduleTabComponent implements OnInit {
  @ViewChild( 'editor' ) editorComponent: CKEditorComponent;
  @Input() ServiceId: number;
  public htmlContent: string;
  public Editor = ClassicEditor;
  public config = {
      language: 'it'
  };
  public form: FormGroup;
  public dataSource:  ICalendar[];
  public service = Services;


  constructor(
    private calendarService: ApiCalendarService,
    public toast: NotificationsService,
    private errorMessageTranslatorService: ErrorMessageTranslatorService,

    ) {
      this.form = new FormGroup({});
     }

  ngOnInit() {
    this.getData();
  }


  onSubmit() {
    const newDataSource: ICalendar[] = _.flatMap(this.dataSource, data => {
      return data[1];
    })
    .map((data: ICalendar) => {
      data.time_start = this.form.controls[data.id + '__time_start'].value;
      this.form.removeControl(data.id + '__time_start');
      data.time_end = this.form.controls[data.id + '__time_end'].value;
      this.form.removeControl(data.id + '__time_end');
      delete data.id;
      delete data.service;
      return data;
    });
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.calendarService.apiUpdateChannel(newDataSource, this.htmlContent)
      .subscribe(data => {
            this.toast.success('Calendario aggiornato con successo!');
            this.getData();
        }, (err) => {
            const errorMessageTranslated = this.errorMessageTranslatorService.translate(_.get(err, 'error.message', ''));
            this.toast.error(errorMessageTranslated);
        });
  }

  private getData() {
    this.calendarService.apiGetCalendarFromService(this.ServiceId).pipe(
      map(data => {
        _.forEach(data, element => {
          this.form.addControl(
            element.id + '__time_start', new FormControl(element.time_start, [
              Validators.required,
              Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
            ])
          );
          this.form.addControl(
            element.id + '__time_end', new FormControl(element.time_end, [
              Validators.required,
              Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
            ])
          );
        });
        this.form.updateValueAndValidity();
        return data;
      }),
      tap(data => {
        this.htmlContent = data[0].service.description;
        _.orderBy(data , 'weekday_start');
      }),
      map(data => {
        return _.map(DayOfWeek, item => {
          return [item, _.filter(data, day => DayOfWeek[day.weekday_start] === item)];
        });
      }),
    )
    .subscribe((data) => {
      this.dataSource = data;
    });
  }

  openPicker(element) {
    const InputEl: HTMLElement = document.getElementById(element);
    InputEl.click();
  }

  addRow(day: any[]) {
    const d = DayOfWeek.findIndex(x => x === day[0]);
    const hour = moment().format('H:mm');
    const test: ICalendar = {
      id: day[1].length + 101,
      id_service: this.ServiceId,
      month_end: 0,
      month_start: 0,
      monthday_start: 0,
      monthday_end: 0,
      weekday_start: d,
      weekday_end: d,
      time_start: '',
      time_end: '',
    };

    this.form.addControl(
      test.id + '__time_start', new FormControl('', Validators.required)
    );
    this.form.addControl(
      test.id + '__time_end', new FormControl('', Validators.required)
    );
    this.dataSource[d][1].push(test);
  }

  delRow(item: ICalendar) {
    this.dataSource[item.weekday_start][1].splice(this.dataSource[item.weekday_start][1].indexOf(item), 1);

  }
}
