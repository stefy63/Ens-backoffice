import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../main/services/auth/auth.service';

@Injectable()
export class HasPermissionGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> |  boolean {
      let roles = next.data.roles as Array<string>;
      if (!this.auth.hasPermission(roles)) {
        this.router.navigate(['/pages/dashboard']);
        return false;
      }
      return true;
  }
}
