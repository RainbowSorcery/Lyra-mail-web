import request from '@/utils/request'

const url = '/admin-service/sys-user/'

export function sysUserList() {
  return request({
    url: url + 'list',
    method: 'get'
  })
}
