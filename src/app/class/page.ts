export class Page {
  //The number of elements in the page
  size: number = 0;
  //The total number of elements
  totalElements: number = 0;
  //The total number of pages
  totalPages: number = 0;
  //The current page number
  pageNumber: number = 0;
  //The current filter
  filter: string = '';
  //Select Only Operator
  onlyOperator: boolean = false;
}
