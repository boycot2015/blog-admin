import axios from 'axios';
// import type { TableData } from '@arco-design/web-vue/es/table/interface';
import type { HttpResponse } from '@/api/interceptor';

export type ContentData = {
  currentTime: number;
  deadline?: number;
  deadTitle: string;
  newLeast?: [
    {
      id: number;
      title: string;
      isDelete: true;
      content: null;
      url: string;
      img: string;
      categoryName: null;
      status: 1001;
      visitor: null;
      createTime: string;
      updateTime: string;
      comment: [];
    }
  ];
  publicData?: {
    total?: number;
    data?: [
      {
        time: string;
        value: number;
      }
    ];
  };
  visitorData?: {
    total?: number;
    data?: [
      {
        time: string;
        value: number;
      }
    ];
  };
  total: 7362;
};
export interface ContentDataRecord {
  title: string;
  prop: string;
  value: number;
  imgUrl: string;
}

export function queryContentData() {
  return axios.get<ContentData>('/datas').then((res) => {
    return axios.get<HttpResponse>('/category/get').then((cate: any) => {
      return axios.get<HttpResponse>('/tag/get').then((tag: any) => {
        return {
          data: { ...res.data, category: cate.data[1], tag: tag.data[1] },
        };
      });
    });
  });
}

export interface PopularRecord {
  id: number;
  title: string;
  isDelete: true;
  content: null;
  url: string;
  img: string;
  categoryName: null;
  status: 1001;
  visitor: null;
  createTime: string;
  updateTime: string;
  comment: [];
}
export type PopularResult = {
  records: PopularRecord[];
  newLeast: PopularRecord[];
};
export function queryPopularList() {
  return axios.get<PopularResult>('/datas').then((res) => {
    return { data: { records: res.data?.newLeast } };
  });
}
