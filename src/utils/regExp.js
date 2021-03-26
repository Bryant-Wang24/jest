export const phoneRegExp = /^1[0-9]{10}$/
export const emailRegExp = /^[A-Za-z0-9_\u4e00-\u9fa5\.]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
export const companyRegExp = /^([0-9]|[a-zA-Z]|[\u4e00-\u9fa5]|\.|\(|\)|《|》|'|"|、|（|）)*$/
export const companyIdRegExp = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/
// 身份证
export const idRegExp = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

/** * 第一：普通汽车
 * 车牌号格式：汉字 + A-Z + 5位A-Z或0-9(  车牌号不存在字母I和O防止和1、0混淆)
 * （只包括了普通车牌号，教练车，警等车牌号 。部分部队车，新能源不包括在内）
 * 京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼军空海北沈兰济南广成使领
 * 普通汽车规则："[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}"
 * *  第二：新能源车
 * 组成：省份简称（1位汉字）+发牌机关代号（1位字母）+序号（6位），总计8个字符，序号不能出现字母I和字母O
 * 通用规则：不区分大小写，第一位：省份简称（1位汉字），第二位：发牌机关代号（1位字母）
 * 序号位：
 * 小型车，第一位：只能用字母D或字母F，第二位：字母或者数字，后四位：必须使用数字
 * ---([DF][A-HJ-NP-Z0-9][0-9]{4})
 * 大型车，前五位：必须使用数字，第六位：只能用字母D或字母F。
 * ----([0-9]{5}[DF])
 * 新能源车规则："[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))"
*/
// 普通汽车
export const normalCarRegExp = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
// 新能源汽车
export const energyCarRegExp = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/

// 车牌号验证方法
export const isVehicleNumber = vehicleNumber => {
  if (vehicleNumber.length === 7) {
    return normalCarRegExp.test(vehicleNumber)
  } else if (vehicleNumber.length === 8) {
    return energyCarRegExp.test(vehicleNumber)
  } else {
    return false
  }
}
