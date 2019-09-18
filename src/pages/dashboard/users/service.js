import request from '@/utils/request';

export async function findOne(params) {
  return request(`/server/api/user`, {
    params,
  });
}
export async function findOrCreate(data) {
  return request(`/server/api/user`, {
    method: 'POST',
    data,
  });
}
export async function findAndCountAll(params) {
  return request(`/server/api/users`, {
    params,
  });
}
export async function singleCreate(data) {
  return request(`/server/api/users`, {
    method: 'POST',
    data,
  });
}
export async function bulkUpdate({ ids, fields }) {
  return request(`/server/api/users`, {
    method: 'PATCH',
    params: { id: ids },
    data: fields,
  });
}
export async function bulkDestroy(ids) {
  return request(`/server/api/users`, {
    method: 'DELETE',
    params: { id: ids },
  });
}
export async function findByPk(id) {
  return request(`/server/api/users/${id}`, {
    params,
  });
}
export async function updateByPk({ id, ...data }) {
  return request(`/server/api/users/${id}`, {
    method: 'PATCH',
    data,
  });
}
export async function destroyByPk(id) {
  return request(`/server/api/users/${id}`, {
    method: 'DELETE',
  });
}
export async function bulkCreate(data) {
  return request(`/server/api/users/multiple`, {
    method: 'POST',
    data,
  });
}
