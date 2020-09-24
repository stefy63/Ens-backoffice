import { Component, OnInit } from '@angular/core';
import { Services } from '../../../../enums/ticket-services.enum';


@Component({
  selector: 'fuse-schedule-manager',
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss'],
})
export class ScheduleManagerComponent implements OnInit {

  public services = Services;

  constructor( ) {
  }

  ngOnInit() {

  }


}
