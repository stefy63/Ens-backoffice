import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { Location } from '@angular/common';
import { find } from 'lodash';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { ApiTicketService } from '../../../../services/api/api-ticket.service';
import { Status } from '../../../../../enums/ticket-status.enum';
import swal, { SweetAlertType, SweetAlertResult } from 'sweetalert2';
import { ApiTicketHistoryService } from '../../../../services/api/api-ticket-history.service';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { SocketService } from '../../../../services/socket/socket.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { WsEvents } from '../../../../../type/ws-events';
import { Router } from '@angular/router';
import { NormalizeTicket } from '../../../../services/helper/normalize-ticket';
import { HistoryTypes } from '../../../../../enums/ticket-history-type.enum';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'fuse-ticket-head',
  templateUrl: './ticket-head.component.html',
  styleUrls: ['./ticket-head.component.scss']
})
export class TicketHeadComponent implements OnInit, OnDestroy {
  private interval;

  @Input('ticket') newTicket: Observable<ITicket>;
  @Output('open') open: EventEmitter<boolean> = new EventEmitter();
  public ticket: ITicket;
  public ticketReason: string;
  public user;
  public badge = 0;
  public msgAlert: boolean;
  public isOpen = false;
  public timeout = false;


  constructor(
    private location: Location,
    private store: LocalStorageService,
    private apiTicketService: ApiTicketService,
    private socketService: SocketService,
    private apiTicketHistoryService: ApiTicketHistoryService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.user = this.store.getItem('user');
  }

  ngOnInit() {
    this.newTicket.subscribe(async (data: ITicket) => {
      if (this.ticket && this.ticket.status.status === 'NEW' && data.status.status !== 'NEW' && !this.isOpen) {
        await swal({
          title: 'ATTENZIONE! TICKET GIA ACQUISITO',
          text: 'TICKET PRESO IN CARICO DA ALTRO OPERATORE',
          type: 'error'
        });
        this.location.back();
      }
      this.ticket = NormalizeTicket.normalizeItem([data])[0];
      const initMessage = find(data.historys, item => item.type.type === 'INITIAL');
      this.ticketReason = (initMessage) ? initMessage.action : '';
      if (data.status.status === 'ONLINE' && data.id_operator === this.user.id) {
        this.open.next(true);
        this.isOpen = true;
        this.interval = setInterval(() => {
          this.timeout = moment().isAfter(moment(data.date_time).add(15, 'm'));
        }, 10000);
      }

      this.socketService.getMessage(WsEvents.ticket.updated)
        .subscribe(async (ticket: ITicket) => {
          if (this.ticket && this.ticket.id === ticket.id && ticket.id_operator !== this.user.id) {
            this.open.next(false);
            this.isOpen = false;
            await swal({
              title: 'ATTENZIONE! TICKET ACQUISITO',
              text: 'TICKET PRESO IN CARICO DA ALTRO OPERATORE',
              type: 'error'
            });
            this.router.navigate(['/pages/dashboard']);
          }
        });

      this.msgAlert = (data.id_operator
        && this.user.id !== data.id_operator
        && data.status.status === 'ONLINE');
    },
      (err) => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    this.ticket = null;
    clearInterval(this.interval);
  }

  async acquireTicket() {
    if (this.ticket.id_operator !== this.user.id) {
      const confirm = await this.confirmAlert('Vuoi acquisire il ticket?', '', 'warning');
      if (confirm.value) {
        this.isOpen = this.ticket.status === 'ONLINE';
        this.updateTicketStatus(this.ticket.id_status).subscribe(() => {
          this.msgAlert = false;
          this.open.next(true);
          this.createHistoryTicketSystem('Ticket acquisito da: ' + this.user.userdata.name + ' ' + this.user.userdata.surname).subscribe();
        });
      }
    }
  }

  activateChat() {
    if (this.ticket.status === 'ONLINE' && this.ticket.id_operator !== this.user.id) {
      this.setUserChoise('Conferma Trasferimento Ticket?', 'Trasferito ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    } else if (this.ticket.status === 'CLOSED') {
      this.setUserChoise('Conferma Riapertura Ticket?', 'Riapertura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    } else {
      this.setUserChoise('Conferma Presa in carico Ticket?', 'Acquisito ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    }
  }

  private async setUserChoise(confirmMessage: string, historyMessage: string) {
    const confirm = await this.confirmAlert(confirmMessage, '', 'warning');
    if (confirm.value) {
      this.isOpen = true;
      this.updateTicketStatus(Status.ONLINE)
        .subscribe(
          () => {
            this.createHistoryTicketSystem(historyMessage)
              .subscribe(
                (data) => {
                  console.log('TicketHistory Subscription success');
                },
                (err) => {
                  swal({
                    title: 'ERRORE\'',
                    text: 'Errore nel ticket....' + this.ticket.id,
                    type: 'error'
                  });
                });
          },
          (err) => {
            swal({
              title: 'ERRORE\'',
              text: 'Errore nel ticket....' + this.ticket.id,
              type: 'error'
            });
          });
      this.msgAlert = false;
      this.open.next(true);
    }
  }

  abortChat() {
    this.location.back();
  }

  async closeChat() {
    const confirm = await this.confirmAlert('Conferma chiusura Ticket?', 'Chiusura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname, 'warning');
    if (confirm.value) {
      this.updateTicketStatus(Status.CLOSED)
        .subscribe(() => {
          this.createHistoryTicketSystem('Chiusura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname)
            .subscribe(() => {
              this.location.back();
            });
        });
    }
  }

  private async refuseChat() {
    return await swal({
      title: 'Conferma Rifiuto Chat?',
      text: 'Inserire la motivazione di questa scelta!',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Conferma',
      showLoaderOnConfirm: true,
      preConfirm: (message) => {
        return new Promise((resolve) => {
          if (!message) {
            swal.showValidationError(
              'Questo messaggio è obbligatorio.'
            );
          }
          resolve();
        });
      },
    }).then(async (result) => {
      if (result.value) {
        this.isOpen = true;
        this.updateTicketStatus(Status.REFUSED)
          .subscribe(() => {
            // tslint:disable-next-line:max-line-length
            this.createHistoryTicketSystem('Rifiutato ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname + 'per il seguente motivo: ' + result.value)
              .subscribe(() => {
                swal({
                  type: 'success',
                  title: 'La Chat è stata rifiutata!',
                  html: 'Rifiutata per: ' + result.value
                });
                this.location.back();
              });
          });
      }
    });
  }

  private confirmAlert(title: string, text: string, type: SweetAlertType): Promise<SweetAlertResult> {
    return swal({
      title: title,
      text: text,
      type: type,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Conferma',
      cancelButtonText: 'Annulla'
    });
  }

  private createHistoryTicketSystem(message: string): Observable<ITicketHistory> {
    const createHistory: ITicketHistory = {
      id: null,
      id_ticket: this.ticket.id,
      id_type: HistoryTypes.SYSTEM,
      action: message,
      readed: 1
    };
    return this.apiTicketHistoryService.create(createHistory);
  }

  private updateTicketStatus(id_status: number): Observable<ITicket> {
    const updateTicket = {
      id: this.ticket.id,
      id_status: id_status,
      id_operator: this.user.id
    };
    return this.apiTicketService.update(updateTicket as ITicket);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '80%',
      data: {ticket_data: this.ticket.date_time, ticket_service: this.ticket.service, }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // this.animal = result;
    });
  }

}


@Component({
  selector: 'fuse-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls: ['./ticket-head.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
