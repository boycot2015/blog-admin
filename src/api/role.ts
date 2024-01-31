import axios from 'axios';
import type { Pagination } from '@/types/global';
import type { RouteRecordNormalized } from 'vue-router';

interface ParamsProps {
  name?: string;
  id?: number | string | unknown | undefined;
  desc?: number | string | unknown | undefined;
}

export interface LoginRes {
  data: string;
  success: boolean;
  code: number;
}

export function queryRoleList(params: ParamsProps & Pagination) {
  if (params.size) {
    params.pageSize = params.size;
    delete params.size;
  }
  return axios.get('/role/get', { params }).then((res) => {
    return { data: { records: res.data[0] || [], total: res.data[1] } };
  });
}
export function addRole(data: ParamsProps) {
  return axios({ url: '/role/add', method: 'post', data });
}
export function editRole(data: ParamsProps) {
  return axios({ url: '/role/edit', method: 'post', data });
}
export function getRoleById(params: ParamsProps) {
  return axios({ url: '/role/get/ById', method: 'get', params });
}
export function deleteRole(params: ParamsProps) {
  return axios({ url: '/role/delete', method: 'post', params });
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/role/menu');
}
