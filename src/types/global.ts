export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: string | number | Record<string, any> | undefined;
  label: string;
  disabled?: boolean;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  current?: number;
  size?: number;
  pageSize?: number;
  defaultPagesize?: number;
  total: number;
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number }>;
}
