import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Ministere, Mission } from '../../../core/models/event.model';
import { ApiService } from '../../../core/services/api.service';
import { MinistereService } from '../../../core/services/ministere.service';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent {

  
  // Remplacez : open: boolean[] = [false, false, false, false];
  open = new Set<number>();

  toggleMission(i: number): void {
    this.open.has(i) ? this.open.delete(i) : this.open.add(i);
  }

  isOpen(i: number): boolean {
    return this.open.has(i);
  }
  missions = signal<Mission[]>([]);
  articles = signal<Ministere[]>([]);
   
   ministere = signal<Ministere | null>(null); // peut être null au départ
  

  loading = signal(true);
   constructor(private apiService: ApiService, private router: Router, private min: MinistereService) {}
  
  ngOnInit(): void {
    this.loadArticles();
    this.loadMins();
    
  }

   loadArticles(): void {
      this.loading.set(true);

      this.min.getAllMissions().subscribe({
        next: (response) => {
          if (response.success) {
            // articles DEJA paginés par le backend
            this.missions.set(response.data.content);

            

          
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }



    loadMins(): void {
      this.loading.set(true);

      this.apiService.getAllMins(0, 10).subscribe({
        next: (response) => {
          if (response.success) {
            // articles DEJA paginés par le backend
            this.articles.set(response.data.content);

            // Récupérer l'ID du premier ministère
            const articlesArray = this.articles(); // <-- important !

            if (articlesArray.length > 0) {
              const ministereId = articlesArray[0].id;
              this.loadMinistereById(ministereId);
            }

          
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }


    loadMinistereById(id: number) {
      this.apiService.getminById(id).subscribe({
        next: (response) => {
          
          if (response.success) {
       this.ministere.set(response.data); // ✅ extraire data
        //console.log('Ministère chargé :', this.ministere);
        } else {
          console.error('Erreur :', response.message);
        }
        },
        error: (err) => {
          console.error('Erreur chargement ministère', err);
        }
      });
    }

  formatContent(content: string): string {
    if (!content) return '';
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const paragraphs = content.split(/\n+/);
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
  }



}
