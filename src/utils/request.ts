import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useLoginStore } from '@/store';
import { getToken } from '@/utils/auth';
import modalErrorWrapper from '@/utils/modal-error-wrapper';
import messageErrorWrapper from '@/utils/message-error-wrapper';

// default config
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.timeout = 60000; // 1 分钟
}

export interface HttpResponse<T = unknown> {
  // success: boolean; // 是否成功
  status: string;
  code: number; // 状态码
  message: string; // 状态信息
  data: T; // 返回数据
}

// request interceptors
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    // 二进制数据则直接返回
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      return response;
    }

    const res = response.data;
    if (res.status === 'success') {
      return res;
    }
    messageErrorWrapper({
      content: res.message || '网络错误',
      duration: 5 * 1000,
    });
    return Promise.reject(new Error(res.message || '网络错误'));
  },
  (error) => {
    const { response } = error;
    const { status } = response;
    if ([401].includes(status) && response.config.url !== '/auth/me') {
      modalErrorWrapper({
        title: '确认退出',
        content: '登录已过期，请重新登录',
        maskClosable: false,
        escToClose: false,
        okText: '重新登录',
        async onOk() {
          const userStore = useLoginStore();
          // await userStore.logout();
          userStore.logoutCallBack();
          window.location.reload();
        },
      });
    } else {
      const { data } = response;
      messageErrorWrapper({
        content: data.message || '网络错误',
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);
