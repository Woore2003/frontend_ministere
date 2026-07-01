import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<div class="h-screen flex flex-col bg-slate-50 overflow-hidden">

  <!-- ================= HEADER ================= -->
  <header class="bg-white border-b border-slate-100 sticky top-0 z-50 flex-shrink-0">
    <div class="flex items-center justify-between h-16 px-4 lg:px-8">

      <!-- LEFT -->
      <div class="flex items-center gap-4">

        <button (click)="sidebarOpen.set(!sidebarOpen())"
          class="p-2 rounded-lg hover:bg-slate-100 lg:hidden transition-colors">

          <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>

        </button>

        <a routerLink="/admin" class="flex items-center gap-3">

          <div class="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="assets/images/armoirie.png" class="w-full h-full object-contain">
          </div>

          <span class="font-semibold text-slate-800 hidden sm:block">
            Administration
          </span>

        </a>

      </div>

      <!-- RIGHT -->
      <div class="flex items-center gap-4">

        <a routerLink="/"
          class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary-600 transition-all">

          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>

        </a>

        <div class="relative">

          <button (click)="userMenuOpen.set(!userMenuOpen())"
            class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors">

            <div class="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
              <span class="text-primary-600 font-semibold text-sm">
                {{ authService.currentUser()?.firstName?.charAt(0) || 'U' }}
              </span>
            </div>

            <span class="hidden sm:block text-sm font-medium text-slate-700">
              {{ authService.currentUser()?.firstName || 'Utilisateur' }}
            </span>

            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 9l-7 7-7-7"></path>
            </svg>

          </button>

          @if (userMenuOpen()) {
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow border border-slate-100 py-1 z-50">

              <a routerLink="/admin/profile"
                (click)="userMenuOpen.set(false)"
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">

                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>

                Mon profil
              </a>

              <button (click)="logout()"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-slate-50">

                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>

                Déconnexion
              </button>

            </div>
          }

        </div>

      </div>
    </div>
  </header>

  <!-- ================= BODY ================= -->
  <div class="flex flex-1 overflow-hidden">

    <!-- ================= SIDEBAR (scroll indépendant) ================= -->
    <aside class="w-64 bg-white border-r border-slate-100 overflow-y-auto h-full">

      <nav class="p-4 space-y-1">

        <!-- DASHBOARD -->
        <a routerLink="/admin/dashboard"
          routerLinkActive="bg-slate-100 font-semibold"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100">

          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>

          Dashboard
        </a>

        <!-- CONTENU -->
        <div class="pt-4 px-4 text-xs text-slate-400 uppercase">Contenu</div>

        <a routerLink="/admin/articles" class="sidebar-item">Articles</a>
        <a routerLink="/admin/services" class="sidebar-item">Services Publics</a>
        <a routerLink="/admin/agendas" class="sidebar-item">Agendas</a>
        <a routerLink="/admin/projects" class="sidebar-item">Projets</a>
        <a routerLink="/admin/documents" class="sidebar-item">Documents</a>
        <a routerLink="/admin/evenements" class="sidebar-item">Évènements</a>

        <!-- COMMUNICATION -->
        <div class="pt-4 px-4 text-xs text-slate-400 uppercase">Communication</div>

        <a routerLink="/admin/contacts" class="sidebar-item">Messages</a>

        <!-- ADMIN -->
        @if (authService.isAdmin()) {

          <div class="pt-4 px-4 text-xs text-slate-400 uppercase">Administration</div>

          <a routerLink="/admin/users" class="sidebar-item">Utilisateurs</a>
          <a routerLink="/admin/types" class="sidebar-item">Types Documents</a>
          <a routerLink="/admin/types-projets" class="sidebar-item">Types Projets</a>

          <div class="pt-4 px-4 text-xs text-slate-400 uppercase">Ministère</div>

          <a routerLink="/admin/ministère" class="sidebar-item">Ministère</a>
          <a routerLink="/admin/ministre" class="sidebar-item">Ministre</a>
          <a routerLink="/admin/organigramme" class="sidebar-item">Organigramme</a>
          <a routerLink="/admin/domains" class="sidebar-item">Domaines</a>
          <a routerLink="/admin/structures" class="sidebar-item">Structures</a>
          <a routerLink="/admin/missions" class="sidebar-item">Attributions</a>
          <a routerLink="/admin/etats" class="sidebar-item">États</a>

        }

      </nav>

    </aside>

    <!-- ================= MAIN ================= -->
    <main class="flex-1 overflow-y-auto p-6 bg-slate-50">

      <router-outlet></router-outlet>

    </main>

  </div>

</div>
  `,
  styles: [`
    .sidebar-item {
      @apply block px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-700;
    }
  `]
})
export class AdminLayoutComponent {
  sidebarOpen = signal(false);
  userMenuOpen = signal(false);

  constructor(public authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }
}