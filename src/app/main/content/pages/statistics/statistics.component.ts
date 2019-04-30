import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ApiStatisticsService } from '../../../services/api/api-statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public fromDate: FormControl;
  public toDate: FormControl;

  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;

  constructor(
    private spinner: NgxSpinnerService,
    private statisticsService: ApiStatisticsService
  ) {
    this.fromDate = new FormControl(moment('1-1-2019', 'D-M-YYYY').toDate());
    this.toDate = new FormControl(moment().toDate());
   }

  ngOnInit() {
    this.getResult();
  }

  getResult() {
    this.statisticsService.get({fromDate: this.fromDate.value, toDate: this.toDate.value})
      .subscribe(data => {
        console.log(data);
      });
  }

}
