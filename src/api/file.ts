import axios from 'axios';
import type { Pagination } from '@/types/global';
import { apiUrl } from './baseUrl';
// import type { HttpResponse } from '@/api/interceptor';

interface ParamsProps {
  name?: string;
  id?: number | string | unknown | undefined;
  page?: number | string | unknown | undefined;
  per_page?: number | string;
  currentPage?: number | string | unknown | undefined;
  pageSize?: number | string | unknown | undefined;
  sourceFrom?: number | string;
  w?: number | string;
  h?: number | string;
}
export interface FileData {
  url?: string;
  ids: number | string[] | undefined;
  name?: string;
}

export function queryFileList(params: ParamsProps & Pagination) {
  // 本地数据库数据
  if (params.sourceFrom !== 1002) {
    params.currentPage = params.current;
    params.pageSize = params.size;
    delete params.size;
    delete params.current;
    return axios.get(`${apiUrl}/files`, { params }).then((res) => {
      return {
        data: {
          records: (res.data.records || []).map((el: any) => ({
            ...el,
            url: el.url,
            title: el.name,
            realUrl: el.origionUrl,
          })),
          total: res.data.total,
        },
      };
    });
  }
  // 网络数据
  params.per_page = params.size;
  params.page = params.current;
  delete params.size;
  delete params.current;
  params.w = '1920';
  params.h = '1080';
  return axios.get(`${apiUrl}/wallpaper`, { params }).then((res) => {
    return {
      data: {
        records: (res.data.list || []).map((el: any) => ({
          ...el,
          url: el.url.replace('&q=80&w=1080', '&q=80&w=200'),
          realUrl: el.url.replace('&q=80&w=1080', '&q=80&w=1200'),
        })),
        total: res.data.total_count,
      },
    };
  });
}
export function deleteFileById(data: FileData) {
  return axios({
    method: 'post',
    url: `${apiUrl}/files/delete`,
    data,
  });
}
