import { Component, OnInit } from '@angular/core';
import { ToastOptions } from '../../../../type/toast-options';

@Component({
  selector: 'fuse-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public options = ToastOptions;

  constructor() { }

  ngOnInit() {
  }

}
