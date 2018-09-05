import { Component, OnInit } from '@angular/core';
import { ToastOptions } from '../../../../type/toast-options';

@Component({
  selector: 'fuse-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.scss']
})
export class UsermanagerComponent implements OnInit {

  public options = ToastOptions;

  constructor() { }

  ngOnInit() {
  }

}
