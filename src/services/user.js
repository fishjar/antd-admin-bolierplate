import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function queryMenus(params) {
  return request('/server/api/user/menus', { params });
}
export async function queryCurrentUser() {
  return request('/server/api/user/current');
}
