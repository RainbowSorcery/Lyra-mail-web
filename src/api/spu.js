import request from '@/utils/request'

const url = '/product-service/product/pms-spu-info/'

export function saveSpu(data) {
  return request({
    url: url + 'save',
    method: 'post',
    data
  })
}

export function getSpuPageList(current, pageSize, key, catelogId, brandId, status) {
  return request({
    url: url + 'list?current=' + current + '&pageSize=' + pageSize + '&key=' + key + '&catelogId=' + catelogId + '&brandId=' + brandId + '&status=' + status,
    method: 'get'
  })
}
