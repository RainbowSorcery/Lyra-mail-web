import request from '@/utils/request'

const url = '/product-service/product/pms-sku-info/'

export function skuPageList(current, pageSize, key, catelogId, brandId, min, max) {
  return request({
    url: url + 'list?current=' + current + '&pageSize=' + pageSize + '&key=' + key + '&catelogId=' + catelogId + '&brandId=' + brandId + '&max=' + max + '&min=' + min,
    method: 'get'
  })
}
