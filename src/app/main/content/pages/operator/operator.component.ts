import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ApiUserService } from './../../../services/api/api-user.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})
export class OperatorComponent implements OnInit {

  constructor(
    private spinner: NgxSpinnerService,
    private operatorService: ApiUserService,
    private toast: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getResult();
  }

  getResult() {
    this.spinner.show();
    const timeout = setTimeout(() => {
      this.spinner.hide();
      this.toast.error('Download File!', 'Operazione Fallita!');
    }, 10000);
    this.operatorService.apiGetOperatorFile().subscribe(data => {
      const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
      a.href = window.URL.createObjectURL(data.file);
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      clearTimeout(timeout);
      this.spinner.hide();
      this.toast.success('Download File!', 'Operazione conclusa!');
    });
    this.router.navigate(['pages/dashboard']);
  }

}
