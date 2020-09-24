import { Component, OnInit, Input, ViewChild, AfterViewInit, LOCALE_ID } from '@angular/core';
import * as _ from 'lodash';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/it';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { Services } from '../../../../../enums/ticket-services.enum';
import {DayOfWeek} from '../../../../../enums/day-of-week.enum';
import { ApiCalendarService } from '../../../../services/api/api-calendar.service';
import { ICalendar } from '../../../../../interfaces/i-calendar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../../../../type/date-format';
import * as moment from 'moment';
import { tap, map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';



@Component({
  selector: 'fuse-schedule-tab',
  templateUrl: './schedule-tab.component.html',
  styleUrls: ['./schedule-tab.component.scss'],
  // providers: [
    // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // { provide: LOCALE_ID, useValue: 'it' }
  // ]
})
export class ScheduleTabComponent implements OnInit, AfterViewInit {
  @ViewChild( 'editor' ) editorComponent: CKEditorComponent;
  @Input() ServiceId: number;
  public htmlContent: string;
  public Editor = ClassicEditor;
  public config = {
      language: 'it'
  };
  public form: FormGroup;
  public dataSource:  ICalendar[];
  public displayedColumns = [
    'weekday_start',
    'time_start',
    'time_end',
    'id',
  ];
  public service = Services;
  public week = DayOfWeek;

  constructor(
    private calendarService: ApiCalendarService,
    private atp: AmazingTimePickerService
    ) {
      this.form = new FormGroup({});
     }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    this.calendarService.apiGetCalendarFromService(this.ServiceId).pipe(
      map(data => {
        _.forEach(data, element => {
          this.form.addControl(
            element.id + '__time_start', new FormControl(element.time_start, Validators.required)
          );
          this.form.addControl(
            element.id + '__time_end', new FormControl(element.time_end, Validators.required)
          );
        });
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
      console.log(data);
      this.dataSource = data;


    });


  }


  onSubmit() {
    const newDataSource: ICalendar[] = _.flatMap(this.dataSource, data => {
      return data[1];
    });
    console.log(newDataSource);
  }


  onChange( { editor }: ChangeEvent) {
    console.log(editor.getData());
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
    console.log('Remove row ', item);
    this.dataSource[item.weekday_start][1].splice(this.dataSource[item.weekday_start][1].indexOf(item), 1);

  }
}
