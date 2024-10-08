import { Routes } from '@angular/router';
import { BaseComponent } from './components/layout/base/base.component';
import { SigninComponent } from './components/signin/signin.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './views/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        children: [{ path: '', component: HomeComponent, pathMatch: 'full' }],
        canActivateChild: [AuthGuard]
    },

    //no layout routes
    { path: 'login', component: SigninComponent },
    // { path: 'register', component: RegisterComponent },

    { path: '**', redirectTo: '' }
];
