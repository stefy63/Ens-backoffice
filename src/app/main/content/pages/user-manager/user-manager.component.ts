import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../class/page';
import { IUser } from '../../../../interfaces/i-user';
import { ApiUserService } from '../../../services/api/api-user.service';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material';
import { DialogProfileComponent } from '../../../toolbar/dialog-component/profile/profile.component';
import { DialogChangePassword } from '../../../toolbar/dialog-component/dialog-change-password.component';

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

  constructor(
    private apiUserService: ApiUserService,
    private toast: NotificationsService,
    public dialog: MatDialog,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo){
    this.page.pageNumber = pageInfo.offset;
    this.page.filter = this.filter || '';
    this.apiUserService.apiGetUserList(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });
  }

  public updateFilter(value) {
    this.filter = value.toLowerCase();
    this.page.filter = this.filter;
    this.apiUserService.apiGetUserList(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
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

    const dialogRef = this.dialog.open(DialogProfileComponent, {
      maxWidth: '850px',
      maxHeight: '600px',
      hasBackdrop: true,
      data: {
          modalData: user
      }
  });

  dialogRef
      .afterClosed()
      .filter((result) => !!result)
      .flatMap((result) => this.apiUserService.apiChangeProfile(result))
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
