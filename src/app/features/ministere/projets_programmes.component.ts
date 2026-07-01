import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-projets-programmes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-4">Projets et Programmes</h1>
      <p class="mb-6">Bienvenue sur la page des projets et programmes.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-2">Projet 1</h2>
          <p class="text-gray-700">Description du projet 1.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-2">Projet 2</h2>
          <p class="text-gray-700">Description du projet 2.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-2">Programme 1</h2>
          <p class="text-gray-700">Description du programme 1.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class ProjetsProgrammesComponent {
}