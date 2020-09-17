import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ApiStatisticsService } from '../../../services/api/api-statistics.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepickerInputEvent, MatTableDataSource, MatSort } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../../../type/date-format';
import { DataAggregationsService } from '../../../services/helper/data-aggregations.service';
import { iElement } from '../../../../interfaces/i-sum-service-operator';
import { NotificationsService } from 'angular2-notifications';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'fuse-schedule-manager',
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ScheduleManagerComponent implements OnInit {

  public fromDate: FormControl;
  public toDate: FormControl;
  public sumServices = [];
  public sumMonthAndServices = [];
  public sumOfficeAndServices = [];
  public sumServicesAndOffice = [];
  public sumServicesAndOperator = [];

  public dataSource: MatTableDataSource<iElement>;
  @ViewChild(MatSort) sort: MatSort;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Periodo';
  showYAxisLabel = false;
  yAxisLabel = 'Servizi';
  timeline = true;
  autoScale = true;
  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;


  constructor(
    private spinner: NgxSpinnerService,
    private statisticsService: ApiStatisticsService,
    private toast: NotificationsService,
    private dataAggregationsService: DataAggregationsService
  ) {
  }

   addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      if(type === 'input' && moment(event.value).isValid() ) {
        this.getResult();
      }
    }

  ngOnInit() {
    this.getResult();
  }

  getResult() {
    this.spinner.show();
    delay(3000);
    this.spinner.hide();
  }


}
