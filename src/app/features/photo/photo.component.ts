import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../../core/models/event.model';
@Component({
  selector: 'app-photo',
  imports: [CommonModule],
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent {
  private readonly API_URL = 'http://localhost:3000'; // Remplacez par l'URL de votre API

  photos: any[] = [];
  loading = false;
  photo = signal<Photo[]>([]);
  constructor() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.loading = true;
    fetch(`${this.API_URL}/photos`)
      .then(response => response.json())
      .then(data => {
        this.photo.set(data);
        this.loading = false;
      })
      .catch(error => {
        console.error('Erreur lors du chargement des photos:', error);
        this.loading = false;
      });
  }

  trackById(index: number, photo: any): number {
    return photo.id;
  }

}