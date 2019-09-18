import request from '@/utils/request';

export async function findOne(params) {
  return request(`/server/api/role`, {
    params,
  });
}
export async function findOrCreate(data) {
  return request(`/server/api/role`, {
    method: 'POST',
    data,
  });
}
export async function findAndCountAll(params) {
  return request(`/server/api/roles`, {
    params,
  });
}
export async function singleCreate(data) {
  return request(`/server/api/roles`, {
    method: 'POST',
    data,
  });
}
export async function bulkUpdate({ ids, fields }) {
  return request(`/server/api/roles`, {
    method: 'PATCH',
    params: { id: ids },
    data: fields,
  });
}
export async function bulkDestroy(ids) {
  return request(`/server/api/roles`, {
    method: 'DELETE',
    params: { id: ids },
  });
}
export async function findByPk(id) {
  return request(`/server/api/roles/${id}`, {
    params,
  });
}
export async function updateByPk({ id, ...data }) {
  return request(`/server/api/roles/${id}`, {
    method: 'PATCH',
    data,
  });
}
export async function destroyByPk(id) {
  return request(`/server/api/roles/${id}`, {
    method: 'DELETE',
  });
}
export async function bulkCreate(data) {
  return request(`/server/api/roles/multiple`, {
    method: 'POST',
    data,
  });
}
