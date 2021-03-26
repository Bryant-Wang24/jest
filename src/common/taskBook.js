export const TASK_BOOK_STATE = {
  HAS_GENERATED: 'HAS_GENERATED',
  NO_GENERATED: 'NO_GENERATED',
  HAS_ISSUED: 'HAS_ISSUED'
}

export const TASK_BOOK_STATE_TEXT = {
  HAS_GENERATED: '已生成',
  NO_GENERATED: '未生成',
  HAS_ISSUED: '已下发'
}

// 弹窗展示类型
export const DIALOG_TYPE = {
  SHOW_HANDOVER: 'SHOW_HANDOVER',
  SEND_BOOK: 'SEND_BOOK'
}

// 状态筛选options
export const TASK_BOOK_STATE_OPTIONS = [
  {
    value: TASK_BOOK_STATE.NO_GENERATED,
    label: TASK_BOOK_STATE_TEXT.NO_GENERATED
  },
  {
    value: TASK_BOOK_STATE.HAS_GENERATED,
    label: TASK_BOOK_STATE_TEXT.HAS_GENERATED
  }, {
    value: TASK_BOOK_STATE.HAS_ISSUED,
    label: TASK_BOOK_STATE_TEXT.HAS_ISSUED
  }
]

export const TASKLINK_TYPE = [
  { label: '对接期', value: 'LINK_PERIOD' },
  { label: '筹展期', value: 'OUTLAWS_PERIOD' },
  { label: '开展期', value: 'CARRY_OUT_PERIOD' },
  { label: '布展期', value: 'EXHIBIT_PERIOD' },
  { label: '撤展期', value: 'MOVEIN_PERIOD' },
  { label: '活动布置', value: 'ACTIVITY_ARRANGEMENT' },
  { label: '活动彩排', value: 'ACTIVITY_REHEARSAL' },
  { label: '活动进行', value: 'ACTIVITY_FOR' },
  { label: '活动散场', value: 'ACTIVITY_OVER' }
]

