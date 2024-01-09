import axios from 'axios';
import type { Pagination } from '@/types/global';
import type { RouteRecordNormalized } from 'vue-router';
import type { HttpResponse } from '@/api/interceptor';

interface ParamsProps {
  name?: string;
  id?: number | string | unknown | undefined;
  email?: number | string | unknown | undefined;
  avatar?: number | string | unknown | undefined;
  status?: number | string;
}
export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  data: string;
  success: boolean;
  code: number;
}
export function login(data: LoginData) {
  return axios.post('/user/login', data);
  //   return Promise.resolve({ data: { token: '1231232', ...data } });
}
export function queryUserList(params: ParamsProps & Pagination) {
  if (params.size) {
    params.pageSize = params.size;
    delete params.size;
  }
  return axios.get('/user/get', { params }).then((res) => {
    return { data: { records: res.data[0] || [], total: res.data[1] } };
  });
}
export function addUser(data: ParamsProps) {
  return axios({ url: '/user/add', method: 'post', data });
}
export function editUser(data: ParamsProps) {
  return axios({ url: '/user/edit', method: 'post', data });
}
export function queryUser(params: ParamsProps) {
  return axios({ url: '/user/get/ById', method: 'get', params });
}
export function changeStatus(data: ParamsProps) {
  return axios.post<HttpResponse>('/user/status', data);
  //   return Promise.resolve({ data: { token: '1231232', ...data } });
}
export function deleteUser(params: ParamsProps) {
  return axios({ url: '/user/delete', method: 'post', params });
  //   return Promise.resolve({ data: { token: '1231232', ...data } });
}
export function logout() {
  return axios.post('/user/logout');
}

// export function getUserInfo() {
//   return axios.post<UserState>('/user/info');
// }

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/user/menu');
}
