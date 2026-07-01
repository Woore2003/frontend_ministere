import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { agritube } from '../../core/models/event.model';
import { environment } from '../../../environments/environment';
@Component({
    selector: 'app-agritube',
    imports: [CommonModule],
    templateUrl: './agritube.component.html',
    styleUrls: ['./agritube.component.scss']
})
export class AgritubeComponent {
    private readonly API_URL = environment.apiUrl;
    agritubes: any[] = [];
    loading = false;
    agritube = signal<agritube[]>([]);
    constructor() {
        this.loadAgritubes();
    }
    
    loadAgritubes() {
        this.loading = true;
        fetch(`${this.API_URL}/agritubes`)
            .then(response => response.json())
            .then(data => {
                this.agritube.set(data);
                this.loading = false;
            })
            .catch(error => {
                console.error('Erreur lors du chargement des agritubes:', error);
                this.loading = false;
            });
    }
    
    trackById(index: number, agritube: any): number {
        return agritube.id;
    }

}