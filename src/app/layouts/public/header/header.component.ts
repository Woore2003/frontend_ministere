import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Ministere } from '../../../core/models/event.model';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { MinistereService } from '../../../core/services/ministere.service';


@Component({
  selector: 'app-header',
  standalone: true,
imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
   loading = signal(true);
    private authService = inject(AuthService);
     private readonly API_URL = environment.FileUrl;
     private apiService = inject(ApiService);
     private etatService = inject(MinistereService);
  
  mobileMenuOpen = signal(false);
  searchOpen = signal(false);
  openSubmenu = signal<string | null>(null);

     ministeres= signal<Ministere[]>([]);
     ministere1!: Ministere;
     ministere = signal<Ministere | null>(null); 


      ngOnInit() {
    this.loadMinistere();
    
    
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
    if (!this.mobileMenuOpen()) {
      this.openSubmenu.set(null);
    }
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    this.openSubmenu.set(null);
  }
  
  toggleSearch() {
    this.searchOpen.update(v => !v);
  }
  
  toggleSubmenu(menu: string) {
    this.openSubmenu.update(v => v === menu ? null : menu);
  }
  
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      this.mobileMenuOpen.set(false);
      this.openSubmenu.set(null);
    }
  }

    loadMinistere(): void {
      this.loading.set(true);

      this.apiService.getAllMins(0, 10).subscribe({
        next: (response) => {
          if (response.success) {
            // articles DEJA paginés par le backend
            this.ministeres.set(response.data.content);

            // Récupérer l'ID du premier ministère
            const articlesArray = this.ministeres(); // <-- important !

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

      getImageUrl(path?: string): string | null {
     console.log(path);
    return path ? this.API_URL + path : null;
   
  }

}
