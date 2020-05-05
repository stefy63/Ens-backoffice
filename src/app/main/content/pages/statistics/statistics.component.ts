import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ApiStatisticsService } from '../../../services/api/api-statistics.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepickerInputEvent, MatTableDataSource, MatSort, Sort } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../../../type/date-format';
import { DateValidator } from '../../../services/MaterialValidator/DateValidator';
import { DataAggregationsService } from '../../../services/helper/data-aggregations.service';
import { sumBy, get, find } from 'lodash';
import { ServiceColorEnum } from '../../../../enums/service-color.enum';
import { ServiceNameEnum } from '../../../../enums/service-name.enum';
import { iElement } from '../../../../interfaces/i-sum-service-operator';
import { NotificationsService } from 'angular2-notifications';


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


  customColorSchemeOffice = [
    {
      name: 'PIEMONTE',
      value: 'cornflowerblue',
    }, {
      name: 'TOSCANA',
      value: 'darkcyan',
    }, {
      name: 'UMBRIA',
      value: 'mediumvioletred'
    },{
      name: 'ABRUZZO',
      value: 'gold',
    }, {
      name: 'CAMPANIA',
      value: '#A69392',
    }, {
      name: 'BASILICATA',
      value: '#CC636F'
    },{
      name: 'CALL CENTER',
      value: '#28395F',
    }
  ];

  customColorSchemeService = [
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


  displayedColumns = ['name', 'office', 'CHAT', 'SMS', 'MAIL', 'VIDEOCHAT', 'TELEGRAM', 'TOTALE'];


  constructor(
    private spinner: NgxSpinnerService,
    private statisticsService: ApiStatisticsService,
    private toast: NotificationsService,
    private dataAggregationsService: DataAggregationsService
  ) {
    this._setDefaultDate();
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
    this.statisticsService.get({fromDate: this.fromDate.value, toDate: this.toDate.value})
      .subscribe(data => {
        this.sumServices = this.dataAggregationsService.sumByServices(data);
        this.sumMonthAndServices = this.dataAggregationsService.sumByMonthAndServices(data);
        this.sumOfficeAndServices = this.dataAggregationsService.sumByOfficeAndServices(data);
        this.sumServicesAndOffice = this.dataAggregationsService.sumByServicesAndOffice(data);
        this.dataSource  = new MatTableDataSource(this.dataAggregationsService.sumByServicesAndOperator(data));
        this.spinner.hide();
      }, (err) => {
        this.toast.error('Statistiche', 'Date ERRATE!');
        this._setDefaultDate();
        this.spinner.hide();
      });
  }

  private _setDefaultDate() {
    this.fromDate = new FormControl(moment('1-1-' + moment().year().toString(), 'D-M-YYYY').toDate(), [Validators.required, DateValidator.date]);
    this.toDate = new FormControl(moment(new Date(), 'D-M-YYYY').toDate(), [Validators.required, DateValidator.date]);
  }

  sumPieTicket(item): number {
    return parseInt(sumBy(item.series, (channel) => channel.value));
  }

  getStyleColor(service: string): string {
    return get(ServiceColorEnum, service);
  }

  getServiceName(name: string): string {
    return get(ServiceNameEnum, name);
  }

  getServiceValue(items: any, service: string): number {
    return parseInt((find(items, {'name': service})) ? find(items, {'name': service}).value : 0);
  }

  getSumByOperator(items: any): number {
    return parseInt(sumBy(items, (channel) => parseInt(channel.value)));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction == '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'office': return this.compare(a.office, b.office, isAsc);
        case 'CHAT': return this.compare(this.getServiceValue(a.series, 'CHAT'), this.getServiceValue(b.series, 'CHAT'), isAsc);
        case 'SMS': return this.compare(this.getServiceValue(a.series, 'SMS'), this.getServiceValue(b.series, 'SMS'), isAsc);
        case 'MAIL': return this.compare(this.getServiceValue(a.series, 'MAIL'), this.getServiceValue(b.series, 'MAIL'), isAsc);
        case 'VIDEOCHAT': return this.compare(this.getServiceValue(a.series, 'VIDEOCHAT'), this.getServiceValue(b.series, 'VIDEOCHAT'), isAsc);
        case 'TELEGRAM': return this.compare(this.getServiceValue(a.series, 'TELEGRAM'), this.getServiceValue(b.series, 'TELEGRAM'), isAsc);
        case 'TOTALE': return this.compare(this.getSumByOperator(a.series), this.getSumByOperator(b.series), isAsc);
        default: return 0;
      }
    });
  }


  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
