import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {find, flatMap, get, forEach, filter, orderBy} from 'lodash';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/it';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { Services } from '../../../../../enums/ticket-services.enum';
import {DayOfWeek} from '../../../../../enums/day-of-week.enum';
import { ApiCalendarService } from '../../../../services/api/api-calendar.service';
import { ICalendar } from '../../../../../interfaces/i-calendar';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { ErrorMessageTranslatorService } from '../../../../services/error-message-translator.service';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { ITicketService } from '../../../../../interfaces/i-ticket-service';


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
  public dataSource:  any[];
  public service = Services;
  private ticketService: ITicketService[];


  constructor(
    private calendarService: ApiCalendarService,
    private storage: LocalStorageService,
    public toast: NotificationsService,
    private errorMessageTranslatorService: ErrorMessageTranslatorService,

    ) {
      this.form = new FormGroup({});
     }

  ngOnInit() {
    this.ticketService = this.storage.getItem('services');
    this.htmlContent = find(this.ticketService, {id: this.ServiceId}).description;
    this.getData();
  }


  onSubmit() {
    const newDataSource: ICalendar[] = flatMap(this.dataSource, data => {
      return data[1];
    })
    .map((data: ICalendar) => {
      data.time_start = this.form.controls[data.id + '__time_start'].value;
      data.time_end = this.form.controls[data.id + '__time_end'].value;
      this._delControl(data);
      delete data.id;
      delete data.service;
      return data;
    });
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.calendarService.apiUpdateChannel(this.ServiceId, newDataSource, this.htmlContent)
      .subscribe(data => {
            this.toast.success('Calendario aggiornato con successo!');
            this.ticketService.find( item => item.id === this.ServiceId).description = this.htmlContent;
            this.storage.setDataItem('services', this.ticketService);
            this.getData();
        }, (err) => {
            const errorMessageTranslated = this.errorMessageTranslatorService.translate(get(err, 'error.message', ''));
            this.toast.error(errorMessageTranslated);
        });
  }

  private getData() {

    this.calendarService.apiGetCalendarFromService(this.ServiceId).pipe(
      map(data => {
        forEach(data, (element: ICalendar) => {
          this._addControl(element);
        });
        this.form.updateValueAndValidity();
        return DayOfWeek.map((item, index) => {
          return {dayNumber: index, day: item, timeSeries: filter(data, (day: ICalendar) => DayOfWeek[day.weekday_start] === item)};
        });
      }),
    )
    .subscribe((data) => {
        data = orderBy(data , 'weekday_start');
      this.dataSource = data;
    });
  }

  openPicker(element) {
    document.getElementById(element).click();
  }

  addRow(day: any) {
    const calendar: ICalendar = {
      id: day.timeSeries.length + 101,
      id_service: this.ServiceId,
      month_end: 0,
      month_start: 0,
      monthday_start: 0,
      monthday_end: 0,
      weekday_start: day.dayNumber,
      weekday_end: day.dayNumber,
      time_start: '',
      time_end: '',
    };
    this._addControl(calendar);
    this.dataSource[day.dayNumber].timeSeries.push(calendar);
    this.form.updateValueAndValidity();
  }

  delRow(item: ICalendar) {
    this.dataSource[item.weekday_start].timeSeries.splice(item, 1);
    this._delControl(item);
    this.form.updateValueAndValidity();

  }

  private _delControl(element: ICalendar){
    this.form.removeControl(element.id + '__time_start');
    this.form.removeControl(element.id + '__time_end');
  }


  private _addControl(element: ICalendar){
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
  }

}
