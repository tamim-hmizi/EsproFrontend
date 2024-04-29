import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate} from '@angular/router';


@Injectable({
    providedIn: 'root'
  })
  export class RoleGuardService implements CanActivate {
  role:string;
    constructor(private router: Router) {}
  
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      this.role = localStorage.getItem('role');
      
      if (this.role === 'ADMIN') {
        return true;
      } else if (this.role === 'USER') {
        this.router.navigate(['/notfound']);
        return false;
      } else {
        // Ajouter une redirection ou un traitement pour les autres rôles ou si le rôle n'est pas défini
        return false;
      }
    }
  }
  