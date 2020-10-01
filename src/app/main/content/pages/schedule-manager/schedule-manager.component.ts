import { Component } from '@angular/core';
import { ITicketService } from '../../../../interfaces/i-ticket-service';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { ServiceNameEnum } from '../../../../enums/service-name.enum';


@Component({
  selector: 'fuse-schedule-manager',
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss'],
})
export class ScheduleManagerComponent {

  public services: ITicketService;
  public serviceName = ServiceNameEnum;

  constructor(
    private storage: LocalStorageService,
  ) {
    this.services = this.storage.getItem('services');
  }


}
