export const SITE_TYPE_ENUM = {
  PAVILION: 'PAVILION', // 展馆类型
  AUDITORIUM: 'AUDITORIUM', // 会议类型
  ADVERTISEMENT: 'ADVERTISEMENT', // 广告位
  FOOD: 'FOOD',
  STREET: 'STREET',
  OTHER: 'OTHER'
}

export const SITE_TYPE = {
  [SITE_TYPE_ENUM.PAVILION]: '展馆',
  [SITE_TYPE_ENUM.AUDITORIUM]: '会议厅',
  [SITE_TYPE_ENUM.ADVERTISEMENT]: '广告位'
}

export const SITES_TYPE_ARRAY = [
  { label: '展馆', value: SITE_TYPE_ENUM.PAVILION },
  { label: '会议厅', value: SITE_TYPE_ENUM.AUDITORIUM },
  { label: '广告位', value: SITE_TYPE_ENUM.ADVERTISEMENT }
]

export const SITE_FILTER_TYPE = [
  {
    value: SITE_TYPE_ENUM.PAVILION,
    label: '展馆'
  },
  {
    value: SITE_TYPE_ENUM.AUDITORIUM,
    label: '会议厅'
  },
  {
    value: SITE_TYPE_ENUM.ADVERTISEMENT,
    label: '广告位'
  },
  {
    value: SITE_TYPE_ENUM.FOOD,
    label: '美食广场'
  },
  {
    value: SITE_TYPE_ENUM.STREET,
    label: '商业街'
  },
  {
    value: SITE_TYPE_ENUM.OTHER,
    label: '其它'
  }
]

export const SHOP_SITE_RADIO_LIST = [
  {
    value: SITE_TYPE_ENUM.FOOD,
    label: '美食广场'
  },
  {
    value: SITE_TYPE_ENUM.STREET,
    label: '商业街'
  },
  {
    value: SITE_TYPE_ENUM.OTHER,
    label: '其它'
  }
]

export const SCHEDULE_STATE_ARRAY = [
  {
    value: 'RESERVE',
    label: '预定'
  },
  {
    value: 'LOCK',
    label: '锁定'
  },
  {
    value: 'CHANGING',
    label: '变更中'
  },
  {
    value: 'CHANGED',
    label: '已变更'
  },
  {
    value: 'RESCINDED',
    label: '已撤销'
  }
]
// zh state
export const SCHEDULE_STATE = {
  RESERVE: 'RESERVE',
  LOCK: 'LOCK',
  CHANGING: 'CHANGING',
  CHANGED: 'CHANGED',
  RESCINDED: 'RESCINDED'
}

export const SITE_APPROVE_TYPE_ARRAY = [
  {
    value: 'SAVED',
    label: '未提交'
  },
  {
    value: 'SUBMITTED',
    label: '审核中'
  },
  {
    value: 'APPROVED',
    label: '审核通过'
  },
  {
    value: 'REJECTED',
    label: '已拒绝'
  }
]

export const SITE_APPROVE_TYPE = {
  SAVED: 'SAVED',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
}
export const SITE_APPROVE_TYPE_ZH = {
  SAVED: '未提交',
  SUBMITTED: '审核中',
  APPROVED: '审核通过',
  REJECTED: '已拒绝',
  NULL: '-'
}

export function SiteTimeArrangeFromItemObject(type) {
  this.dateList = []
  this.startTime = '08:30'
  this.endTime = '17:00'
  this.type = type
}
export function SiteAreaItem() {
  this.siteId = '' // 场地id
  this.siteName = '' // 场地名字
  this.siteArea = '' // 面积
  this.pitchNumber = '' // 节数
  this.sessions = '' // 场次
  this.info = {}
}
