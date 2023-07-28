import axios from 'axios';
// import type { TableData } from '@arco-design/web-vue/es/table/interface';

export type ContentData = {
  //   articleNum?: number;
  [articleNum: string]: number;
  picNum: number;
  recruitNum: number;
};
export interface ContentDataRecord {
  title?: string;
  prop?: string;
  value?: number;
  imgUrl?: string;
}

export function queryContentData() {
  return axios.get<ContentData>('/index');
}

export interface PopularRecord {
  createTime: string;
  id: number;
  operationIp: string;
  operationMethod: string;
  operationModule: string;
  operationReqParam: string;
  operationResult: string;
  operationType: string;
  operationUri: string;
  operationUserId: number;
  operationUserName: string;
}
export type PopularResult = {
  logInfoList: PopularRecord[];
};
export function queryPopularList(params: { type: string }) {
  return axios.get<PopularResult>('/index', { params });
}
