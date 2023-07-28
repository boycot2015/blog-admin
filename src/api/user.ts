import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
// import { UserState } from '@/store/modules/user/types';

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
