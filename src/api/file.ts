import axios from 'axios';
import type { Pagination } from '@/types/global';
import { apiUrl } from './baseUrl';
// import type { HttpResponse } from '@/api/interceptor';

interface ParamsProps {
  name?: string;
  id?: number | string | unknown | undefined;
  page?: number | string | unknown | undefined;
  per_page?: number | string;
  w?: number | string;
  h?: number | string;
}
export interface FileData {
  url: string;
  name: string;
}

export function queryFileList(params: ParamsProps & Pagination) {
  if (params.size) {
    params.per_page = params.size;
    params.page = params.current;
    delete params.size;
    delete params.current;
  }
  params.w = '1920';
  params.h = '1080';
  return axios.get(`${apiUrl}/wallpaper`, { params }).then((res) => {
    return {
      data: {
        records: (res.data.list || []).map((el: any) => ({
          ...el,
          url: el.url.replace('&q=80&w=1080', '&q=80&w=120'),
          realUrl: el.url,
        })),
        total: res.data.total_count,
      },
    };
  });
}
