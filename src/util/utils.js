export const VEHICLE_TYPES = [
  {value: '中型面包车'},
  {value: '2.4M货车'},
  {value: '4.2M货车'},
  {value: '4.2M宽体'},
  {value: '6.8M货车'},
  {value: '7.6M货车'},
  {value: '9.6M货车'},
  {value: '专线'}
];

export const PICK_VEHICLE_TYPES = VEHICLE_TYPES.map(item => item.value).concat('其他车型');

export const EMOJI_REGEX = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]/ig;


export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};


export const getStore = name => {
  if (!name) return;
  let content = window.localStorage.getItem(name);
  try {
    content = JSON.parse(content);
  } catch (e) {
    console.warn('error json: ' + content);
  }
  return content || {};
};


export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 筛选 object 特定的 key
 * @param obj
 * @param keys
 * @returns {*}
 */
export const pick = (obj, keys) => {
  return Object.keys(obj)
  .filter(key => keys.includes(key))
  .reduce((newObj, key) => Object.assign(newObj, {[key]: obj[key]}), {})
};

/**
 * 反向筛选 object 特定的 key
 * @param obj
 * @param keys
 * @returns {*}
 */
export const omit = (obj, keys) => {
  return Object.keys(obj)
  .filter(key => !keys.includes(key))
  .reduce((newObj, key) => Object.assign(newObj, {[key]: obj[key]}), {})
};

export const dateFormat = (date, fmt = 'YYYY-MM-DD HH:mm', def = '') => {
  if (!date) {
    return def;
  }
  if (typeof date === 'string') {
    date = new Date(date.lastIndexOf('.000Z') != -1 ? date : date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  let o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  let week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
};

export const showToast = function (error) {
  this.$emit('toastEvent', {
    show: true,
    text: (typeof error === 'string') ? (error || '网络错误') : (error.return_info || '网络错误')
  });
};

export const replaceEmoji = (obj, keys) => {
  if (Array.isArray(keys)) {
    keys.forEach(key => {
      obj[key] = obj[key] ? obj[key].replace(EMOJI_REGEX, '').trim() : '';
    });
  } else {
    obj[keys] = obj[keys] ? obj[keys].replace(EMOJI_REGEX, '').trim() : '';
  }
};
