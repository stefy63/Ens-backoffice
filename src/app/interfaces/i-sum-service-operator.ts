export interface iSeries {
  name: string;
}

export interface iElement {
  name: string;
  office: number;
  series: iSeries[];
}

