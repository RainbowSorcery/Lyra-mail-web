import request from '@/utils/request'

const url = '/product-service/product/pms-attr/'

export function saveAttr(data) {
  return request({
    url: url + 'save',
    method: 'post',
    data
  })
}

export function findBaseAttrList(categoryId, current, pageSize, keyword) {
  return request({
    url: url + '/base/list/' + categoryId + '?pageSize=' + pageSize + '&current=' + current + '&keyword=' + keyword,
    method: 'get'
  })
}
