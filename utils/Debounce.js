export function debounce(func, wait, immediate) {
      let timeout;
      return (...args) => {
        const context = this;
        const later = () => {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          func.apply(context, args);
        }
      };
    }
  export const debounceAdv =  (func,delay)=>{
    let timeOutId;
  
    return (...args) =>{
      clearTimeout(timeOutId)
      timeOutId = setTimeout(() => {
        func.apply(null,args)
      }, delay);
    }
  } 
    