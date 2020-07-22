import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange, MatDialog } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, filter, mergeMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { Page } from '../../../../class/page';
import { IUser } from '../../../../interfaces/i-user';
import { ApiUserService } from '../../../services/api/api-user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ErrorMessageTranslatorService } from '../../../services/error-message-translator.service';
import { DialogChangePassword } from '../../../toolbar/dialog-component/dialog-change-password.component';
import { DialogProfileComponent } from './profile/profile.component';
import { DialogRegistrationComponent } from './registration/regstration.component';

@Component({
  selector: 'fuse-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit, OnDestroy, AfterViewChecked {

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
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
   }


  ngOnInit() {
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
          this.page.onlyOperator = this.onlyOperator.value;
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

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
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
    this.page.onlyOperator = this.onlyOperator.value;
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
              this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
          }, (err) => {
            this.toast.error('Aggiornamento Profilo', this.errorTranslator.translate(err.error.message));            
          }, () => this.setPage({ offset: this.page.pageNumber }));
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
    this.setPage({ offset: 0 });
  }

    exportFile() {
      this.spinner.show();
      this.apiUserService.exportUserDetails(this.filter, !!this.page.onlyOperator).subscribe(data => {
          const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
          a.href = window.URL.createObjectURL(data.file);
          a.download = data.filename;
          document.body.appendChild(a);
          a.click();
          this.toast.success('Download File!', 'Operazione conclusa!');
        }, () => {
          this.toast.error('Download File!', 'Operazione Fallita!');
        }, () => this.spinner.hide());
  }

  registration(): void {
    this.dialog.open(DialogRegistrationComponent);
  }
}
