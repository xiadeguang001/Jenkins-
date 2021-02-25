/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 换算乘数 14位整数 4位小数
 */
export function isMultiplierNum () {
  return /(^[0-9]{1,14}$)|(^[0-9]{1,14}[\.]{1}[0-9]{1,4}$)/
}

/**
 * 邮箱
 */
export function isEmailBox () {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/
}

/**
 * 手机号码
 */
export function isMobileNumber () {
  return /^1[0-9]{10}$/
}

/**
 * 电话号码
 */
export function isPhoneNumber () {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/
}

/**
 * 主页地址
 */
export function isHomePage () {
  return /^http[s]?:\/\/.*/
}

/**
 * 数字
 */
export function isNumber () {
  return /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,1})?$/
}

/**
 * 传真
 */
export function isFax () {
  return /^(\d{3,4}-)?\d{7,8}$/
}

/**
 * 邮政编号
 */
export function isZipCode () {
  return /^[0-9]\d{5}(?!\d)$/
}

/**
 * 英数字
 */
export function isEngNum () {
  return /^[0-9a-zA-Z]+$/
}