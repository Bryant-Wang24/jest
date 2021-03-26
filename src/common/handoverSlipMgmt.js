export const STATE = {
  REVIEW: '审核中',
  PROGRESS: '交接中', // (审核通过)
  PASSED: '已交接',
  REJECTED: '已拒绝',
  CANCEL: '已作废'
}

export const STATE_OBJECT = {
  REVIEW: 'REVIEW',
  PROGRESS: 'PROGRESS', // (审核通过)
  PASSED: 'PASSED',
  REJECTED: 'REJECTED',
  CANCEL: 'CANCEL'
}

export const STATE_ARRAY = [
  {
    label: '已交接',
    value: 'PASSED'
  },
  {
    label: '审核中',
    value: 'REVIEW'
  },
  {
    label: '交接中',
    value: 'PROGRESS'
  },
  {
    label: '已拒绝',
    value: 'REJECTED'
  },
  {
    label: '已作废',
    value: 'CANCEL'
  }
]

export const TIMETYPE = {
  'DEPLOY': 'exh',
  'OPEN': 'launch',
  'CLOSE': 'move'
}
export const TIMETYPE_REVERSE = {
  'exh': 'DEPLOY',
  'launch': 'OPEN',
  'move': 'CLOSE'
}

export const TIMETYPE_ARRAY = ['DEPLOY', 'OPEN', 'CLOSE']
export const TIMETYPE_OBJECT = { DEPLOY: 'DEPLOY', OPEN: 'OPEN', CLOSE: 'CLOSE', RESERVED: 'RESERVED' }

export const getSiteName = (siteid, list) => {
  let name = ''
  for (let i = 0; i < list.length; i++) {
    const site = list[i]
    if (site.id === parseInt(siteid)) {
      name = site.siteName
      break
    }
  }
  return name
}
