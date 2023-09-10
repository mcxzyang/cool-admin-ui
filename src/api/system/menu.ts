import { TreeNodeData } from '@arco-design/web-vue';
import axios from 'axios';
import qs from 'query-string';

const BASE_URL = '/adminMenu';

export interface DataRecord {
  id?: string;
  title: string;
  pid?: string | number;
  type: number;
  path?: string;
  name?: string;
  icon?: string;
  ignoreCache: boolean;
  hideInMenu: boolean;
  permission?: string;
  sort: number;
  status?: number;
  createUserString?: string;
  createTime?: string;
  updateUserString?: string;
  updateTime?: string;
  children?: Array<DataRecord>;
  parentName?: string;
}

export interface ListParam {
  name?: string;
  status?: number;
}

export function list(params: ListParam) {
  return axios.get<DataRecord[]>(`${BASE_URL}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function listTree() {
  return axios.get<TreeNodeData[]>(`${BASE_URL}/list/tree`);
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
