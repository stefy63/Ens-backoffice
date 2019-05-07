import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ApiStatisticsService } from '../../../services/api/api-statistics.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../../../type/date-format';
import { DateValidator } from '../../../services/MaterialValidator/DateValidator';
import { ServiceColorEnum } from '../../../../enums/service-color.enum';
import { Services } from '../../../../enums/ticket-services.enum';
import { chain, groupBy, sumBy, mapValues} from 'lodash';

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
  public sumMonthAndServices;
  public sumOfficeAndServices;
  public sumServicesAndOffice;
  public sumServicesAndOperator;

  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;

  constructor(
    private spinner: NgxSpinnerService,
    private statisticsService: ApiStatisticsService
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
        this.sumServices = this.sumByServices(data);
        console.log(this.sumServices);
        this.sumMonthAndServices = this.sumByMonthAndServices(data);
        this.sumOfficeAndServices = this.sumByOfficeAndServices(data);
        this.sumServicesAndOffice = this.sumByServicesAndOffice(data);
        this.sumServicesAndOperator = this.sumByServicesAndOperator(data);
        console.log(data);
        this.spinner.hide();
      });
  }

  sumByServices(data) {
    const result = chain(data)
                    .groupBy(item => item.ticket_service)
                    .mapValues(values => sumBy(values, (value) => parseInt(value.ticket_sub_total)))
                    .value();
    return result;
  }
  sumByOffices(data) {
    const result = chain(data)
                    .groupBy(item => item.ticket_office_name)
                    .mapValues(values => sumBy(values, (value) => parseInt(value.ticket_sub_total)))
                    .value();
    return result;
  }

  sumByMonthAndServices(data) {
    const result = chain(data)
                    .groupBy(item => `${item.ticket_year}/${(item.ticket_month < 10) ? `0${item.ticket_month}` : item.ticket_month}`)
                    .mapValues(values => this.sumByServices(values))
                    .value();
    console.log('sumOverviewTime--->', result);
    return result;
  }

  sumByOfficeAndServices(data) {
    const result = chain(data)
        .groupBy(item => `${item.ticket_office_name}`)
        .mapValues(values => this.sumByServices(values))
        .value();
    console.log('sumByOfficeAndServices--->', result);
    return result;
  }

  sumByServicesAndOffice(data) {
    const result = chain(data)
        .groupBy(item => item.ticket_service)
        .mapValues(values => this.sumByOffices(values))
        .value();
    console.log('sumByServicesAndOffice--->', result);
    return result;
  }

  sumByServicesAndOperator(data) {
    const result = chain(data)
        .groupBy(item => `[${item.ticket_operator}] ${item.ticket_operator_surname} ${item.ticket_operator_name}`)
        .mapValues(values => this.sumByServices(values))
        .value();
    console.log('sumByServicesAndOperator--->', result);
    return result;
  }

}
