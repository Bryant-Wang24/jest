// import { DEPARTMENT_KEY } from '@/common/user'
// 全馆or单馆
export const VIEW_TYPE_NUMBER = {
  single: 'single', // 单馆视图
  all: 'all' // 全馆视图
}

export const VIEW_TYPE_NUMBER_ARRAY = [
  {
    label: '单馆视图',
    value: 'single'
  },
  {
    label: '全馆视图',
    value: 'all'
  }
]

export const STATE = [
  { label: '预订', value: 'RESERVE', className: 'keepTip' },
  { label: '锁定', value: 'LOCK', className: 'lockTip' }
]
export const STATE_OBJECT = {
  RESERVE: 'RESERVE',
  LOCK: 'LOCK'
}

export const STATE_OBJECT_TEXT = {
  RESERVE: '预订',
  LOCK: '锁定'
}

export const STATE_DEFAULT = ['RESERVE', 'LOCK']

export const MONTHS = [
  { value: '0', label: '所有月份' },
  { value: '01', label: '1月' },
  { value: '02', label: '2月' },
  { value: '03', label: '3月' },
  { value: '04', label: '4月' },
  { value: '05', label: '5月' },
  { value: '06', label: '6月' },
  { value: '07', label: '7月' },
  { value: '08', label: '8月' },
  { value: '09', label: '9月' },
  { value: '10', label: '10月' },
  { value: '11', label: '11月' },
  { value: '12', label: '12月' }
]
export const MONTHS_ALL_VALUE = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]

export const LEGENDS = [
  { color: '#9DCAFF', label: '布撤展期' },
  { color: '#FF7600', label: '开展期' },
  { color: '#FFEB00', label: '其他安排' },
  { color: '#EDBAF4', label: '布撤重叠' }
]

export const LEGENDS_OBJECT = {
  RESERVE: '#FFEB00',
  LAUNCH: '#FF7600',
  REPEAT: '#EDBAF4',
  EXH_MOVE: '#9DCAFF'
}

