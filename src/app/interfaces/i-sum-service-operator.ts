export interface iSeries {
  name: string;
  value: number;
}

export interface iElement {
  name: string;
  office: string;
  series: iSeries[];
}

