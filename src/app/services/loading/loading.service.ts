import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    public isLoading = signal<boolean>(false);

    setLoading(flag: boolean) {
        this.isLoading.set(flag);
    }
}
