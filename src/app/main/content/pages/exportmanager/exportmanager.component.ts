import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { ITicketCategory } from '../../../../interfaces/i-ticket-category';

@Component({
  selector: 'fuse-exportmanager',
  templateUrl: './exportmanager.component.html',
  styleUrls: ['./exportmanager.component.scss']
})
export class ExportmanagerComponent implements OnInit {

  public formGroup: FormGroup;
  public category: ITicketCategory;

  constructor(
    public fb: FormBuilder,
    private storage: LocalStorageService,
    ) {
      this.category = this.storage.getKey('ticket_category');
     }

  getFontSize() {
    return Math.max(10, this.formGroup.value.fontSize);
  }
  ngOnInit() {
  }

}
