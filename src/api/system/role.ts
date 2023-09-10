import axios from 'axios';
import qs from 'query-string';

const BASE_URL = '/adminRole';

export interface DataRecord {
  id?: string;
  name: string;
  code?: string;
  description?: string;
  menu_ids?: Array<string>;
  status?: number;
  created_at?: string;
}

export interface ListParam {
  name?: string;
  status?: number;
  page?: number;
  size?: number;
  paging?: number;
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
