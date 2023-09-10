import axios from 'axios';

const BASE_URL = '/system/user/center';

export interface BasicInfoModel {
  username: string;
}

export interface AvatarRes {
  avatar: string;
}

export function uploadAvatar(data: FormData) {
  return axios.post<AvatarRes>(`/avatar`, data);
}

export interface UpdateBasicInfoReq {
  username: string;
}

export function updateBasicInfo(req: UpdateBasicInfoReq) {
  return axios.patch(`/basic/info`, req);
}

export interface UpdatePasswordReq {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

export function updatePassword(req: UpdatePasswordReq) {
  return axios.patch(`/auth/updatePassword`, req);
}

export interface UpdateEmailReq {
  newEmail: string;
  captcha: string;
  currentPassword: string;
}

export function updateEmail(req: UpdateEmailReq) {
  return axios.patch(`${BASE_URL}/email`, req);
}
