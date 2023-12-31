import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginReq,
} from '@/api/auth/login';
import { getImageCaptcha as getCaptcha } from '@/api/common/captcha';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useLoginStore = defineStore('user', {
  state: (): UserState => ({
    id: '',
    username: '',
    phone: undefined,
    avatar: undefined,
    description: undefined,
    permissions: [],
    roles: [],
    is_super_admin: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // 获取图片验证码
    getImgCaptcha() {
      return getCaptcha();
    },

    // 用户登录
    async login(req: LoginReq) {
      try {
        const res = await userLogin(req);
        setToken(res.data.access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // 用户退出
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },

    // 获取用户信息
    async getInfo() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },
    // 设置用户信息
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    // 重置用户信息
    resetInfo() {
      this.$reset();
    },
  },
});

export default useLoginStore;
