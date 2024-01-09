import axios from 'axios';
import type { Pagination } from '@/types/global';
// import type { RouteRecordNormalized } from 'vue-router';
// import type { HttpResponse } from '@/api/interceptor';

interface ParamsProps {
  name?: string;
  id?: number | string | unknown | undefined;
  email?: number | string | unknown | undefined;
  avatar?: number | string | unknown | undefined;
  status?: number | string;
}
export interface FileData {
  url: string;
  name: string;
}

export function queryFileList(params: ParamsProps & Pagination) {
  return axios.get('/file/get', { params }).then((res) => {
    return { data: { records: res.data[0] || [], total: res.data[1] } };
  });
}
