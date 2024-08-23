import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';
import { LoadingService } from '../services/loading/loading.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
    fireAuth = inject(AngularFireAuth);
    loadingService = inject(LoadingService);
    router = inject(Router);

    canActivate(): Observable<boolean> {
        return this.checkIfUserIsLoggedIn();
    }
    canActivateChild(): Observable<boolean> {
        return this.checkIfUserIsLoggedIn();
    }

    checkIfUserIsLoggedIn(): Observable<boolean> {
        this.loadingService.setLoading(true);

        return this.fireAuth.authState.pipe(
            map((user) => {
                if (user) {
                    return true; // User is authenticated, allow access
                } else {
                    this.router.navigate(['/login']);

                    // Delay navigation until auth state is fully resolved
                    return false;
                }
            }),
            finalize(() => {
                this.loadingService.setLoading(false);
            })
        );
    }
}
