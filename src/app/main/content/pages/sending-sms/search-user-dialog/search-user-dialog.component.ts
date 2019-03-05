import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'fuse-search-user-dialog',
  templateUrl: './search-user-dialog.component.html',
  styleUrls: ['./search-user-dialog.component.scss'],
})
export class SearchUserDialogComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SearchUserDialogComponent>,
    ) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'name': new FormControl('', []),
      'surname': new FormControl('', []),
    });
  }

  validForm() {
    return !!this.formGroup.controls.name.value || !!this.formGroup.controls.name.value; 
  }

  search() {
    console.log('searching');
  }
}
