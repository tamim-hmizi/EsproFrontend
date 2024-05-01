import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const mytoken = localStorage.getItem('jwt');
//  alert('Token JWT récupéré depuis le localStorage, {mytoken} :');

  if (mytoken != null) {
   
    const cloneRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${mytoken}`)
    });
 // await new Promise(resolve => setTimeout(resolve, 1000));



 
   return next(cloneRequest); 
  }
 

  else {
  
    return next(req);
  }
};