/**
 * 时间数字转换
 * @param {number} n
 * @return {string}
 */
export function formatNumber(n) {
  n = (~~n).toString();
  return n[1] ? n : '0' + n;
}

/**
 * 判断对象是否为空
 * @param {object} obj 传入一个对象
 * @returns {boolean} 返回一个布尔值是空对象返回true反之返回false
 */
export function isEmpty(obj) {
  let tostring = Object.prototype.toString;
  if (obj == null) return true;

  if (tostring.call(obj) == '[object Array]' || tostring.call(obj) == '[object String]') {
    return obj.length === 0;
  }

  if (tostring.call(obj) == '[object Object]') {
    for (let name in obj) {
      return false;
    }
  }

  return true;
}

/**
 *防抖
 * @param {function} fn 延迟要执行的函数
 * @param {number} delay 默认时间为 300ms
 * @returns
 */
export function debounce(fn, delay = 300) {
  let timer = null;

  return async function (...args) {
    clearTimeout(timer);

    timer = setTimeout(async () => {
      await fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流
 * @param {function} fn 要执行的函数
 * @param {number} gapTime 间隔时间 默认：0
 * @returns
 */
export function throttle(fn, gapTime) {
  let _lastTime = null;
  gapTime = gapTime || 0;

  return function () {
    let that = this,
      args = arguments,
      _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(that, args);
      _lastTime = _nowTime;
    }
  };
}

/**
 * 对象属性转url参数
 * @param {object} options 传入一个对象
 * @returns {string} 返回一个string类型
 */
export function formatOptions(options) {
  var urlOptions = '';
  for (var i in options) {
    urlOptions += i + '=' + options[i] + '&';
  }
  urlOptions = urlOptions.slice(0, urlOptions.length - 1);
  return urlOptions;
}

/**
 * 判断是否是数字
 * @param {*}
 * @return {boolean} 是数字返回true 反之false
 */
export function isRealNum(num) {
  if (num === '' || num === null) {
    return false;
  }

  if (typeof num === 'number' && !isNaN(num)) {
    return true;
  }

  return false;
}

/**
 * 比较数据是否一致
 * @param {*} a
 * @param {*} b
 * @returns {boolean} 一致返回true 反之false
 */
export function equals(a, b) {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => equals(a[k], b[k]));
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time 时间戳
 * @param {string} cFormat 要格式化的格式
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 *
 * @param {number} time 时间戳
 * @param {*} option
 * @returns
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
  }
}

/**
 * 保留两位小数
 * @param {number} num 传入的数值
 * @param {number} fixed 需要保留的小数位数:默认是保留两位
 * @return {string}
 */
export function toFixed(num, fixed = 2) {
  let numSplit = num.toString().split('.');
  if (numSplit.length == 1 || !numSplit[1][fixed] || numSplit[1][fixed] <= 4) {
    return num.toFixed(fixed);
  }
  numSplit[1] = +numSplit[1].substring(0, fixed) + 1 + '';
  if (numSplit[1].length > fixed) {
    numSplit[0] = +numSplit[0] + 1;
    numSplit[1] = numSplit[1].substring(1, fixed + 1);
  }
  return numSplit.join('.');
}
