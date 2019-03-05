import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiUserDataService } from '../../../../services/api/api-userdata.service';
import { assign } from 'lodash';
import { IUserDataRequest, IUserDataResponse } from '../../../../../interfaces/i-userdata.request';
@Component({
  selector: 'fuse-search-user-dialog',
  templateUrl: './search-user-dialog.component.html',
  styleUrls: ['./search-user-dialog.component.scss'],
})
export class SearchUserDialogComponent implements OnInit {
  public formGroup: FormGroup;
  public dataSource: MatTableDataSource<IUserDataResponse>;
  public userDataList: IUserDataResponse[] = null; 
  public displayedColumns = ['nome', 'cognome' ];

  constructor(
    public dialogRef: MatDialogRef<SearchUserDialogComponent>,
    public userDataService: ApiUserDataService
    ) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'name': new FormControl('', []),
      'surname': new FormControl('', []),
    });
  }

  validForm() {
    return !!this.formGroup.controls.surname.value || !!this.formGroup.controls.name.value; 
  }

  search() {
    this.userDataService.find(assign<IUserDataRequest>({},
      this.formGroup.controls.name.value ? { name: this.formGroup.controls.name.value} : null,
      this.formGroup.controls.surname.value ? { surname: this.formGroup.controls.surname.value} : null
    )).subscribe((response: IUserDataResponse[]) => {
      this.userDataList = response;
      this.dataSource = new MatTableDataSource(response);
    });
  }

  onUserClick(userItem: IUserDataRequest) {
    this.dialogRef.close(userItem);
  }
}
