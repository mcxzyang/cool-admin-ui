import axios, { Axios, AxiosResponse, AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosResponse<T = any> {
    status: string; // 是否成功
    code: number; // 状态码
    message: string; // 状态信息
    data: T; // 返回数据
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}
