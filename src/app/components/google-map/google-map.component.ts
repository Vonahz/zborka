import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'z-google-map',
    standalone: true,
    imports: [],
    templateUrl: './google-map.component.html',
    styleUrl: './google-map.component.scss'
})
export class GoogleMapComponent {
    sanitizer = inject(DomSanitizer);

    getMapUrl(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.google.com/maps/embed/v1/place?key=AIzaSyDlP4rQGmAZMkk3zaUaISzdIPR7jYNi7uA&q=80,80`
        );
    }
}
