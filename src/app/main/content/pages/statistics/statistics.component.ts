import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ApiStatisticsService } from '../../../services/api/api-statistics.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../../../type/date-format';
import { DateValidator } from '../../../services/MaterialValidator/DateValidator';
import { DataAggregationsService } from '../../../services/helper/data-aggregations.service';
import { sumBy } from 'lodash';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class StatisticsComponent implements OnInit {

  public fromDate: FormControl;
  public toDate: FormControl;
  public sumServices;
  public sumMonthAndServices = [];
  public sumOfficeAndServices = [];
  public sumServicesAndOffice = [];
  public sumServicesAndOperator = [];

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

  customColorScheme = [
    {
      name: 'CHAT',
      value: '#d03a31'
    }, {
      name: 'SMS',
      value: '#e58600',
    }, {
      name: 'MAIL',
      value: '#145936',
    }, {
      name: 'VIDEOCHAT',
      value: '#1e4c9c'
    },{
      name: 'TELEGRAM',
      value: '#4fa7e4',
    }
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private statisticsService: ApiStatisticsService,
    private dataAggregationsService: DataAggregationsService
  ) {
    this.fromDate = new FormControl(moment('1-1-' + moment().year().toString(), 'D-M-YYYY').toDate(), [Validators.required, DateValidator.date]);
    this.toDate = new FormControl(moment(new Date(), 'D-M-YYYY').toDate(), [Validators.required, DateValidator.date]);
   }

   addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      console.log(`${type}: ${event.value}`);
      if(type === 'input' && moment(event.value).isValid() ) {
        this.getResult();
      }
    }

  ngOnInit() {
    this.getResult();
  }

  getResult() {
    this.spinner.show();
    this.statisticsService.get({fromDate: this.fromDate.value, toDate: this.toDate.value})
      .subscribe(data => {
        this.sumServices = this.dataAggregationsService.sumByServices(data);
        console.log('sumServices---> ', this.sumServices);
        this.sumMonthAndServices = this.dataAggregationsService.sumByMonthAndServices(data);
        this.sumOfficeAndServices = this.dataAggregationsService.sumByOfficeAndServices(data);
        this.sumServicesAndOffice = this.dataAggregationsService.sumByServicesAndOffice(data);
        this.sumServicesAndOperator = this.dataAggregationsService.sumByServicesAndOperator(data);
        console.log(data);
        this.spinner.hide();
      });
  }


  sumPieTicket(item) {
    return sumBy(item.series, (channel) => parseInt(channel.value)).toString();
  }


}