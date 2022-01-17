import request from '@/utils/request'

const url = '/ware-service/wms-ware-info/'

export function wareInfoListPage(current, pageSize, key) {
  return request({
    url: url + 'list?current' + current + '&pageSize=' + pageSize + '&key=' + key,
    method: 'get'
  })
}

export function removeByIds(ids) {
  return request({
    url: url + 'delete',
    method: 'post',
    data: ids
  })
}

export function findById(id) {
  return request({
    url: url + 'info/' + id,
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: url + 'save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: url + 'update',
    method: 'post',
    data
  })
}
