import request from '@/utils/request'

const url = 'memeber-service/ums-member-level/'

export function memberLevelPageList(current, pageSize) {
  return request({
    url: url + 'pageList?current=' + current + '&pageSize=' + pageSize,
    method: 'get'
  })
}

export function saveMemberLeve(data) {
  return request({
    url: url + 'save',
    method: 'post',
    data
  })
}

export function updateMemberLevel(data) {
  return request({
    url: url + 'update',
    method: 'post',
    data
  })
}

export function getMemberLevelInfo(memberLevelId) {
  return request({
    url: url + '/info/' + memberLevelId,
    method: 'get'
  })
}

export function deleteMemberList(ids) {
  return request({
    url: url + 'delete',
    method: 'post',
    data: ids
  })
}

export function getMemberLevelList() {
  return request({
    url: url + 'list',
    method: 'get'
  })
}
