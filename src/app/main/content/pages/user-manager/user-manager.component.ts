import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../class/page';
import { IUser } from '../../../../interfaces/i-user';
import { ApiUserService } from '../../../services/api/api-user.service';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material';
import { DialogChangePassword } from '../../../toolbar/dialog-component/dialog-change-password.component';
import { FormControl } from '@angular/forms';
import { debounceTime, mergeMap, tap, filter, flatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogProfileComponent } from './profile/profile.component';

@Component({
  selector: 'fuse-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {

  public page = new Page();
  public rows: IUser[];
  public filter: string;

  @ViewChild('myTable') table;

  private filterControl: FormControl;
  private pageSizeControl: FormControl;
  private debounce: number = 1000;

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
    this.filterControl.valueChanges
      .pipe(
        tap(data => this.spinner.show()),
        debounceTime(this.debounce),
        tap(data => {
          this.filter = data.toLowerCase();
          this.page.filter = this.filter;
        }),
        mergeMap(data => this.apiUserService.apiGetUserList(this.page))
      )
      .subscribe( pagedData => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
          this.spinner.hide();
      });
      this.pageSizeControl.valueChanges.subscribe(data => {
        this.setPage({ offset: 0 });
      });
  }

  setPage(pageInfo){
    this.spinner.show();
    this.page.pageNumber = pageInfo.offset;
    this.page.filter = this.filter || '';
    this.apiUserService.apiGetUserList(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.spinner.hide();
    });
  }

  public changeUserStatus(user: IUser) {
    console.log(user);
    user.disabled = !user.disabled;
    this.apiUserService.apiChangeProfile(user).subscribe(data => {
      this.toast.success('CONFERMA', 'Utente aggiornato con successo!');
    },
    err => {
      this.toast.error('ERRORE', 'Impossibile aggirnare l\'utente!');
    });
  }

  public editProfile(user: IUser) {
      this.dialog.open(DialogProfileComponent, {
        hasBackdrop: true,
        data: {
            modalData: user
        }
    }).afterClosed().pipe(
            filter((result) => !!result),
            flatMap((result) => {
                user.userdata = result;
                return this.apiUserService.apiChangeProfile(user);
            })
        )
        .subscribe(user => {
            this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
        },
        (err) => {
            this.toast.error('Aggiornamento Profilo', 'Modifica Profilo fallita');
        }
        );
  }

  public resetPassword(user: IUser) {
    const dialogRef = this.dialog.open(DialogChangePassword, {
      maxWidth: '550px',
      maxHeight: '370px',
      data: {
          modalData: user.id
      }
  });
  }
}
