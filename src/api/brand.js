import request from '@/utils/request'

const url = '/product-service/product/pms-brand/'

export function getBrandPage(current, pageSize) {
  return request({
    url: url + 'findPage' + '?current=' + current + '&pageSize=' + pageSize,
    method: 'get'
  })
}

export function updateBrand(data) {
  return request({
    url: url + 'update',
    method: 'post',
    data
  })
}

export function addBrand(data) {
  return request({
    url: url + 'addBrand',
    method: 'post',
    data
  })
}

export function getOSSPolicy() {
  return request({
    url: '/third-party-service/OSS/policy',
    method: 'get'
  })
}
