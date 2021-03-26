
// 合同性质
export const CONTRACT_NATURE = {
  /** 主合同 */
  MAIN: { value: 'MAIN', label: '主合同' },
  /** 补充合同 */
  SUPPLEMENTARY: { value: 'SUPPLEMENTARY', label: '补充合同' },
  /** 附加合同 */
  ADDITIONAL: { value: 'ADDITIONAL', label: '附加合同' }
}

// 合同类型
export const CONTRACT_TYPE = {
  VENUE_LEASING: { label: '场馆租赁合同', value: 'VENUE_LEASING' },
  CONFERENCE_LEASING: { label: '会议租赁合同', value: 'CONFERENCE_LEASING' },
  ADV_PRODUCTION_LEASING: { label: '广告制作租赁合同', value: 'ADV_PRODUCTION_LEASING' },
  SERVICE_ORDER: { label: '服务订单', value: 'SERVICE_ORDER' },
  FIRE_SAFETY: { label: '防火安全合同', value: 'FIRE_SAFETY' },
  FIRE_APPROVAL: { label: '消防报批合同', value: 'FIRE_APPROVAL' },
  CONFERENCE_APPROVAL: { label: '会议报批合同', value: 'CONFERENCE_APPROVAL' },
  SHOP_LEASING: { label: '商铺租赁', value: 'SHOP_LEASING' }
}

// 合同code
export const CONTRACT_CODE = {
  /** 保利 - 场馆租赁合同 */
  POLY_VENUE_LEASING: { value: 'POLY_VENUE_LEASING', label: '场馆租赁合同' },
  /** 保利 - 场馆租赁补充合同 */
  POLY_VENUE_LEASING_SUPPLEMENTARY: { value: 'POLY_VENUE_LEASING_SUPPLEMENTARY', label: ' 场馆租赁补充合同' },
  /** 保利 - 纯会议合同 */
  POLY_CONFERENCE_LEASING: { value: 'POLY_CONFERENCE_LEASING', label: '纯会议合同' },
  /** 保利 - 纯宴会合同 */
  POLY_BANQUET_LEASING: { value: 'POLY_BANQUET_LEASING', label: '纯宴会合同' },
  /** 保利 - 纯展厅租赁合同 */
  POLY_EXHIBITION_HALL_LEASING: { value: 'POLY_EXHIBITION_HALL_LEASING', label: '纯展厅租赁合同' },
  /** 保利 - 会议服务合同（展厅+会议厅） */
  POLY_CONFERENCE_AND_EXHIBITION_HALL_LEASING: { value: 'POLY_CONFERENCE_AND_EXHIBITION_HALL_LEASING', label: '会议服务合同（展厅+会议厅）' },
  /** 保利 - 广告订单合同 */
  POLY_ADV_ORDER: { value: 'POLY_ADV_ORDER', label: '广告订单合同' },
  /** 保利 - 服务订单 */
  POLY_SERVICE_ORDER: { value: 'POLY_SERVICE_ORDER', label: '服务订单' },
  /** 保利 - 防火安全合同 */
  POLY_FIRE_SAFETY: { value: 'POLY_FIRE_SAFETY', label: '防火安全合同' },
  /** 保利 - 消防报批合同 */
  POLY_VENUE_LEASING_APPROVAL: { value: 'POLY_VENUE_LEASING_APPROVAL', label: '消防报批合同' },
  /** 保利 - 会议服务合同（报批版） */
  POLY_CONFERENCE_LEASING_APPROVAL: { value: 'POLY_CONFERENCE_LEASING_APPROVAL', label: ' 会议服务合同（报批版）' },
  /** 保利 - 商业街租赁经营合同 */
  POLY_COMMERCIAL_STREET_LEASING_OPERATION: { value: 'POLY_COMMERCIAL_STREET_LEASING_OPERATION', label: '商业街租赁经营合同' },
  /** 保利 - 美食广场租赁经营合同 */
  POLY_FOOD_PLAZA_LEASING_OPERATION: { value: 'POLY_FOOD_PLAZA_LEASING_OPERATION', label: '美食广场租赁经营合同' },
  /** 保利 - 商业街物管协议 */
  POLY_COMMERCIAL_STREET_PROPERTY_MANAGEMENT: { value: 'POLY_COMMERCIAL_STREET_PROPERTY_MANAGEMENT', label: '商业街物管协议' },
  /** 保利 - 美食广场物管协议 */
  POLY_FOOD_PLAZA_PROPERTY_MANAGEMENT: { value: 'POLY_FOOD_PLAZA_PROPERTY_MANAGEMENT', label: '美食广场物管协议' },
  /** 白马 - 场地合同 */
  WHITE_HORSE_FIELD_LEASING: { value: 'WHITE_HORSE_FIELD_LEASING', label: '场地合同' },
  /** 白马 - 服务协议 */
  WHITE_HORSE_SERVICE_AGREEMEN: { value: 'WHITE_HORSE_SERVICE_AGREEMEN', label: '服务协议' }
}

// 不需要跳转的类型
export const DIRECT_CONTRACT_CODE = [
  /** 保利 - 服务订单 */
  'POLY_SERVICE_ORDER',
  /** 白马 - 场地合同 */
  'WHITE_HORSE_FIELD_LEASING',
  /** 白马 - 服务协议 */
  'WHITE_HORSE_SERVICE_AGREEMENT'
]
