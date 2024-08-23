import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading/loading.service';

@Component({
    selector: 'z-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MatProgressBarModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    title = 'Zborka';
    loadingService = inject(LoadingService);

    isLoading = this.loadingService.isLoading;
}
