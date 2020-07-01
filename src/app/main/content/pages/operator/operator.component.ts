import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ApiUserService } from './../../../services/api/api-user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Page } from '../../../../class/page';
import { IOperator } from '../../../../interfaces/i-operator';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';
import { debounceTime, mergeMap, tap, filter } from 'rxjs/operators';
import { ErrorMessageTranslatorService } from '../../../services/error-message-translator.service';
import { IUser } from '../../../../interfaces/i-user';


@Component({
  selector: 'fuse-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})
export class OperatorComponent implements OnInit {

  public page = {
    size:  0,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    filter: '',
    isOperator: true
  };
  public rows: IOperator[];
  private editedUser: IOperator;
  public filter = '';

  @ViewChild('myTable') table;

  public filterControl: FormControl;
  public pageSizeControl: FormControl;
  private debounce = 1000;
  private filterControlSubscription: Subscription;
  private pageSizeControlSubscription: Subscription;

  constructor(
    private apiUserService: ApiUserService,
    private spinner: NgxSpinnerService,
    private toast: NotificationsService,
    public dialog: MatDialog,
    private errorTranslator: ErrorMessageTranslatorService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    // this.getResult();
    this.setPage({ offset: 0 });
    this.filterControl = new FormControl;
    this.pageSizeControl = new FormControl(10);
    this.filterControlSubscription = this.filterControl.valueChanges
      .pipe(
        debounceTime(this.debounce),
        filter((data) => this.filter !== data.toLowerCase()),
        tap(data => {
          this.spinner.show();
          this.filter = data.toLowerCase();
          this.page.filter = this.filter;
          this.page.pageNumber = 0;
        }),
        mergeMap(data => this.apiUserService.apiGetUserList(this.page))
      )
      .subscribe( pagedData => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
          this.spinner.hide();
      }, () => this.spinner.hide());
        this.pageSizeControlSubscription = this.pageSizeControl.valueChanges.subscribe(data => {
        this.setPage({ offset: 0 });
      });
  }

  public resetPassword(user: IUser) {
    // this.dialog.open(DialogChangePassword, {
    //   data: {
    //       modalData: user.id
    //   }
    // });
  }

  public editProfile(user: IUser) {
  //   this.editedUser = cloneDeep(user);
  //   const dialogRef = this.dialog.open(DialogProfileComponent, {
  //     hasBackdrop: true,
  //     data: {
  //         modalData: user
  //     }
  // });

  // dialogRef
  //     .afterClosed()
  //     .filter((result) => !!result)
  //     .flatMap((result) => this.apiUserService.apiChangeProfile(result))
  //     .subscribe(() => {
  //         this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
  //     }, (err) => {
  //       const rowIndex = this.table.bodyComponent.getRowIndex(user);
  //       this.rows[rowIndex] = this.editedUser;
  //       this.toast.error('Aggiornamento Profilo', this.errorTranslator.Translate(err.error.message));
  //       this.editProfile(this.rows[rowIndex]);
  //     });
  }

  public changeUserStatus(user: IUser) {
    user.disabled = !user.disabled;
    this.apiUserService.apiChangeProfile(user).subscribe(data => {
      this.toast.success('CONFERMA', 'Utente aggiornato con successo!');
    },
    err => {
      this.toast.error('ERRORE', 'Impossibile aggiornare l\'utente!');
    });
  }

  getResult() {
    this.spinner.show();
    const timeout = setTimeout(() => {
      this.spinner.hide();
      this.toast.error('Download File!', 'Operazione Fallita!');
    }, 10000);
    this.apiUserService.apiGetOperatorFile().subscribe(data => {
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

  setPage(pageInfo){
    this.spinner.show();
    this.page.pageNumber = pageInfo.offset;
    this.page.filter = this.filter || '';
    this.apiUserService.apiGetUserList(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.spinner.hide();
      document.querySelector('.tab-container').scrollTop = 0;
    }, () => this.spinner.hide());
  }

}
