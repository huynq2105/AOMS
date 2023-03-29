export function debounce(func, wait, immediate) {
    console.log('Func====================',func)
    console.log('wait====================',wait)
    console.log('immediate====================',func)
      let timeout;
      return (...args) => {
        const context = this;
        const later = () => {
          timeout = null;
          if (!immediate) {
            console.log(' da chay vao !immediate====================')
            console.log(' da chay vao !args====================',context)
            func.apply(context, args);
          }
        };
        const callNow = immediate && !timeout;
        console.log(' dcallNow====================',callNow)
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          console.log(' da chay vao !callNow====================')
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
    