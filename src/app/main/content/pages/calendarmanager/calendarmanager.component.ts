import { Component, OnInit } from '@angular/core';
import { ToastOptions } from '../../../../type/toast-options';

@Component({
  selector: 'fuse-calendarmanager',
  templateUrl: './calendarmanager.component.html',
  styleUrls: ['./calendarmanager.component.scss']
})
export class CalendarmanagerComponent implements OnInit {

  public options = ToastOptions;

  constructor() { }

  ngOnInit() {
  }

}
