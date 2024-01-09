import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  //   getUserInfo,
  LoginData,
} from '@/api/user';
import jwtDecode from 'jwt-decode';
import { setToken, getToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => {
    if (getToken()) {
      const data = jwtDecode(getToken() as string) as any;
      return {
        role: data.authorities,
        name: data.userName || data.username,
        mobile: data.mobile,
        roleId: data.roleId,
        accountId: data.id,
      };
    }
    return {
      roleId: undefined,
      name: undefined,
      avatar: undefined,
      job: undefined,
      organization: undefined,
      location: undefined,
      email: undefined,
      introduction: undefined,
      personalWebsite: undefined,
      jobName: undefined,
      organizationName: undefined,
      locationName: undefined,
      phone: undefined,
      registrationDate: undefined,
      accountId: undefined,
      certification: undefined,
      role: [],
    };
  },

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        // this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      this.$patch((state: UserState) => {
        this.setInfo({ ...state });
      });
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        const data = jwtDecode(res.data) as any;
        /**
         * exp: 1690310935
            id: 1
            mobile: "18146681844"
            roleId: 1
            userName: "超级管理员"
         */
        // console.log(data, 'state');
        this.$patch({
          role: data.authorities,
          name: data.userName || data.username,
          mobile: data.mobile,
          roleId: data.roleId,
          accountId: data.id,
        });
        setToken(res.data);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
  // 整个仓库持久化存储
  persist: {
    enabled: true,
    // 指定字段存储，并且指定存储方式：
    strategies: [
      // { storage: sessionStorage, paths: ['count', 'age'] }, // age 和 count字段用sessionStorage存储
      {
        storage: localStorage,
        // , paths: ['']
      }, // accessToken字段用 localstorage存储
    ],
  },
});

export default useUserStore;
