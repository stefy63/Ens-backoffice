import { Component, OnInit } from '@angular/core';
import { ToastOptions } from '../../../../type/toast-options';

@Component({
  selector: 'fuse-permissionmanager',
  templateUrl: './permissionmanager.component.html',
  styleUrls: ['./permissionmanager.component.scss']
})
export class PermissionmanagerComponent implements OnInit {

  public options = ToastOptions;

  constructor() { }

  ngOnInit() {
  }

}
