import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Page } from '../../../../class/page';
import { IUser } from '../../../../interfaces/i-user';
import { ApiUserService } from '../../../services/api/api-user.service';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material';
import { DialogChangePassword } from '../../../toolbar/dialog-component/dialog-change-password.component';
import { FormControl } from '@angular/forms';
import { debounceTime, mergeMap, tap, filter } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs/Subscription';
import { DialogProfileComponent } from './profile/profile.component';

@Component({
  selector: 'fuse-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit, OnDestroy {

  public page = new Page();
  public rows: IUser[];
  public filter: string;

  @ViewChild('myTable') table;

  private filterControl: FormControl;
  private pageSizeControl: FormControl;
  private debounce = 1000;
  private filterControlSubscription: Subscription;
  private pageSizeControlSubscription: Subscription;

  constructor(
    private apiUserService: ApiUserService,
    private toast: NotificationsService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
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
    const dialogRef = this.dialog.open(DialogProfileComponent, {
      hasBackdrop: true,
      data: {
          modalData: user
      }
  });

  dialogRef
      .afterClosed()
      .filter((result) => !!result)
      .flatMap((result) => this.apiUserService.apiChangeProfile(result))
      .subscribe(() => {
          this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
      }, (err) => {
              this.toast.error('Aggiornamento Profilo', 'Modifica Profilo fallita');
      });
  }

  public resetPassword(user: IUser) {
    this.dialog.open(DialogChangePassword, {
      data: {
          modalData: user.id
      }
  });
  }
}
