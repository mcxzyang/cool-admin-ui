import axios from 'axios';
import qs from 'query-string';

const BASE_URL = '/adminUser';

export interface DataRecord {
  id?: string;
  username: string;
  name?: string;
  avatar?: string;
  is_super_admin?: number;
  status?: number;
  password?: string;
  created_at?: string;
  updated_at?: string;
  roles?: Array<number | string>;
  role_names?: Array<string>;
}

export interface ListParam {
  username?: string;
  name?: string;
  status?: number;
  page?: number;
  size?: number;
}

export interface ListRes {
  list: DataRecord[];
  total: number;
}

export function list(params: ListParam) {
  return axios.get<ListRes>(`${BASE_URL}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function get(id: string) {
  return axios.get<DataRecord>(`${BASE_URL}/${id}`);
}

export function addRecord(req: DataRecord) {
  return axios.post(BASE_URL, req);
}

export function updateRecord(id: string | number, req: DataRecord) {
  return axios.put(`${BASE_URL}/${id}`, req);
}

export function del(ids: string | Array<string>) {
  return axios.delete(`${BASE_URL}/${ids}`);
}
