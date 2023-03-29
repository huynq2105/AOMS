export function parseCookie(cookieStr) {
    if (typeof cookieStr !== 'string') return {};
    return cookieStr.split(';').reduce((cookieObject, cookieString) => {
      let splitCookie = cookieString?.split('=');
      if (!splitCookie || splitCookie.length < 2) return cookieObject;
      let key = splitCookie.shift()?.trim();
      if (key) cookieObject[key] = splitCookie?.join('=')?.trim();
      return cookieObject;
    }, {});
  }
  
  export function dumpCookie(cookieObject) {
    let cookieStr = '';
    for (const k in cookieObject) {
      cookieStr += k + '=' + cookieObject[k] + ';';
    }
    return cookieStr;
  }