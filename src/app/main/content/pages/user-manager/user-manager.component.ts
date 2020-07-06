import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Page } from '../../../../class/page';
import { IUser } from '../../../../interfaces/i-user';
import { ApiUserService } from '../../../services/api/api-user.service';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog, MatCheckboxChange, MatDialogRef } from '@angular/material';
import { DialogChangePassword } from '../../../toolbar/dialog-component/dialog-change-password.component';
import { FormControl } from '@angular/forms';
import { debounceTime, mergeMap, tap, filter } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs/Subscription';
import { DialogProfileComponent } from './profile/profile.component';
import { DialogRegistrationComponent } from './registration/regstration.component';
import {findIndex} from 'lodash';
import { ErrorMessageTranslatorService } from '../../../services/error-message-translator.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'fuse-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit, OnDestroy {

  public page = new Page();
  public rows: IUser[];
  private editedUser: IUser;
  public filter = '';

  @ViewChild('myTable') table;

  public filterControl: FormControl;
  public pageSizeControl: FormControl;
  public onlyOperator: FormControl;
  public hasOperatorPermission = false;
  private debounce = 1000;
  private filterControlSubscription: Subscription;
  private pageSizeControlSubscription: Subscription;

  constructor(
    private apiUserService: ApiUserService,
    private toast: NotificationsService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private errorTranslator: ErrorMessageTranslatorService,
    private authService: AuthService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
   }


  ngOnInit() {
    this.setPage({ offset: 0 });
    this.hasOperatorPermission = this.authService.hasPermission(['operator.get.all']);
    this.filterControl = new FormControl;
    this.pageSizeControl = new FormControl(10);
    this.onlyOperator = new FormControl(false);
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

  ngOnDestroy(): void {
    if (this.filterControlSubscription) {
      this.filterControlSubscription.unsubscribe();
    }
    if (this.pageSizeControlSubscription) {
      this.pageSizeControlSubscription.unsubscribe();
    }
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

  public changeUserStatus(user: IUser) {
    user.disabled = !user.disabled;
    this.apiUserService.apiChangeProfile(user).subscribe(data => {
      this.toast.success('CONFERMA', 'Utente aggiornato con successo!');
    },
    err => {
      this.toast.error('ERRORE', 'Impossibile aggiornare l\'utente!');
    });
  }

  public editProfile(user: IUser) {
    // this.editedUser = cloneDeep(user);
    this.apiUserService.apiGetUserById(user.id)
      .subscribe(data => {
        const dialogRef = this.dialog.open(DialogProfileComponent, {
          hasBackdrop: true,
          data: {
              modalData: data
          }
        });

        dialogRef
          .afterClosed()
          .filter((result) => !!result)
          .flatMap((result) => this.apiUserService.apiChangeProfile(result))
          .subscribe((result) => {
              const newUser = findIndex(this.rows, (item) => item.id === result.id);
              this.rows[newUser] = result;
              this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
          }, (err) => {
            const rowIndex = this.table.bodyComponent.getRowIndex(user);
            this.rows[rowIndex] = this.editedUser;
            this.toast.error('Aggiornamento Profilo', this.errorTranslator.Translate(err.error.message));
            this.editProfile(this.rows[rowIndex]);
          });
      });
  }

  public resetPassword(user: IUser) {
    this.dialog.open(DialogChangePassword, {
      data: {
          modalData: user.id
      }
  });
  }

  public setOnlyOperator(ev: MatCheckboxChange) {
    this.page.onlyOperator = ev.checked;
    this.setPage({ offset: 0 });
  }

  exportFile() {
    this.spinner.show();
    if (this.page.onlyOperator) {
      this.exportOpertors();
    } else {
      this.exportUsers();
    }
    this.spinner.hide();
    return;
  }

  private exportOpertors() {
    const timeout = setTimeout(() => {
      this.toast.error('Download File!', 'Operazione Fallita!');
      return;
    }, 10000);
    this.apiUserService.apiGetOperatorFile(this.filter)
      .subscribe(data => {
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        a.href = window.URL.createObjectURL(data.file);
        a.download = data.filename;
        document.body.appendChild(a);
        clearTimeout(timeout);
        a.click();
        this.toast.success('Download File!', 'Operazione conclusa!');
      }, () => {
        this.toast.error('Download File!', 'Operazione Fallita!');
      });
    return;
  }

  private exportUsers() {
    const timeout = setTimeout(() => {
      this.toast.error('Download File!', 'Operazione Fallita!');
      return;
    }, 10000);
    this.apiUserService.apiGetUserFile(this.filter)
      .subscribe( data => {
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        a.href = window.URL.createObjectURL(data.file);
        a.download = data.filename;
        document.body.appendChild(a);
        clearTimeout(timeout);
        a.click();
        this.toast.success('Download File!', 'Operazione conclusa!');
      }, () => {
        this.toast.error('Download File!', 'Operazione Fallita!');
      });
    return;
  }

  Registration(): void {
    this.dialog.open(DialogRegistrationComponent);
  }
}
