import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/it';
import { NotificationsService } from 'angular2-notifications';
import { filter, find, flatMap, forEach, get } from 'lodash';
import { map } from 'rxjs/operators';
import { DayOfWeek } from '../../../../../enums/day-of-week.enum';
import { Services } from '../../../../../enums/ticket-services.enum';
import { ICalendar } from '../../../../../interfaces/i-calendar';
import { ITicketService } from '../../../../../interfaces/i-ticket-service';
import { ApiCalendarService } from '../../../../services/api/api-calendar.service';
import { ErrorMessageTranslatorService } from '../../../../services/error-message-translator.service';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { uuidv4 } from '../../../../services/UuidGenerator';


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
  public editorConfig = {
      language: 'it'
  };
  public form: FormGroup;
  public dataSource:  DayWithTimeSeries[];
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
    const calendars: ICalendar[] = flatMap(this.dataSource, (day: DayWithTimeSeries) => {
      return day.timeSeries;
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
    
    this.calendarService.apiUpdateChannel(this.ServiceId, calendars, this.htmlContent)
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
    ).subscribe((days: DayWithTimeSeries[]) => {
      this.dataSource = days;
    });
  }

  openPicker(element) {
    document.getElementById(element).click();
  }

  addRow(day: any) {
    const calendar: ICalendar = {
      id: uuidv4(),
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

  delRow(item: ICalendar, index: number) {
    this.dataSource[item.weekday_start].timeSeries.splice(index, 1);
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

export interface DayWithTimeSeries {
  dayNumber: number;
  day: string;
  timeSeries: ICalendar[];
}
