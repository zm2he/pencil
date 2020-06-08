import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FirebaseService} from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private firebaseService: FirebaseService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.firebaseService.isLoggedin()) {
      return true;
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }
}
