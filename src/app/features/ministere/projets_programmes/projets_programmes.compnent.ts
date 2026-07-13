import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Domains, ProjetsProgrammes } from '../../../core/models/event.model';
import { MinistereService } from '../../../core/services/ministere.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-projets_programmes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projets_programmes.component.html',
  styleUrls: ['./projets_programmes.component.scss']
})
export class projets_programmesComponent {
private readonly API_URL = environment.FileUrl;
  
   ProjetsProgrammess1: ProjetsProgrammes[] = [];   // 🔹 Variable pour stocker la liste
   domaines1: Domains[] = [];
  loading1 = false;

  ProjetsProgrammes = signal<ProjetsProgrammes[]>([]);  // 🔹 Signal pour les ProjetsProgrammess
  domaines = signal<Domains[]>([]);      // 🔹 Signal pour les domaines
  loading = signal(true);

  constructor(private ProjetsProgrammesService: MinistereService) {}

  ngOnInit(): void {
    this.loadProjetsProgrammes(); this.loadDomaines()
  }


loadDomaines() {
    this.loading.set(true);
    this.ProjetsProgrammesService.getAllDomaines().subscribe({
      next: (response: any) => {
        this.domaines.set(response.data.content || []);
        console.log('Domaines:', this.domaines());
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.loading.set(false);
      }
    });
  }

  getDomaineName(id: number): string {
    const domaine = this.domaines().find(d => d.id === id);
    return domaine ? domaine.nom : '—';
  }


  loadProjetsProgrammes() {
    this.loading.set(true);
    this.ProjetsProgrammesService.getAllProjectsPublic().subscribe({
      next: (response: any) => {
        this.ProjetsProgrammes.set(response.data.content || []);
        console.log('ProjetsProgrammess:', this.ProjetsProgrammes());
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.loading.set(false);
      }
    });
  }
trackByAcronym(index: number, item: ProjetsProgrammes) {
  return item.id;
}
getImageUrl(path?: string): string | null {
     console.log(path);
    return path ? this.API_URL + path : null;
   
  }
}
