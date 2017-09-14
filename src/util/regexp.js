const MOBILE_NUMBER_REGEX = /^1[1|3|4|5|7|8]\d{9}$/;
const TELEPHONE_NUMBER_REGEX = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
const EMAIL_REGEX = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
const PLATE_NUMBER_REGEX = /^[\u4e00-\u9fa5][A-Z_a-z][A-Z_a-z_0-9]{4,5}[A-Z_a-z_0-9_港_澳]$/;

const isMobileNumber = val => {
  return MOBILE_NUMBER_REGEX.test(val.trim());
}

const isTelephoneNumber = val => {
  return TELEPHONE_NUMBER_REGEX.test(val.trim());
}

const isEmail = val => {
  return EMAIL_REGEX.test(val.trim());
}

const isPlateNumber = val => {
  return PLATE_NUMBER_REGEX.test(val.trim());
}

export {
  isMobileNumber, isTelephoneNumber, isEmail, isPlateNumber
}
