import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Project, ProjectStatus } from '../../../core/models';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Projets</h1>
          <p class="text-neutral-500">Gérez les projets et programmes</p>
        </div>

        <button (click)="openModal()" class="btn-primary">
          Nouveau projet
        </button>
      </div>

      <div class="card p-0">

        @if (loading()) {
          <div class="p-8 text-center">
            <div class="spinner w-8 h-8 mx-auto"></div>
          </div>
        }

        @else if (projects().length === 0) {
          <div class="p-8 text-center text-neutral-500">
            Aucun projet pour le moment
          </div>
        }

        @else {
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Progression</th>
                  <th>Partenaire</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                @for (project of projects(); track project.id) {
                  <tr>

                    <!-- NOM -->
                    <td>
                      <p class="font-medium">{{ project.name }}</p>
                      <p class="text-xs text-neutral-400">
                        {{ project.description }}
                      </p>
                    </td>

                    <!-- STATUT -->
                    <td>
                      <span [class]="getStatusBadgeClass(project.status)">
                        {{ getStatusLabel(project.status) }}
                      </span>
                    </td>

                    <!-- PROGRESSION (MODIFIABLE) -->
                    <td>
                      <div class="flex items-center gap-2">

                        <button
                          class="btn-ghost p-1"
                          (click)="changeProgress(project, -5)">
                          -
                        </button>

                        <div class="w-24 bg-neutral-200 rounded-full h-2">
                          <div
                            class="bg-primary-500 h-2 rounded-full transition-all"
                            [style.width.%]="project.progressPercentage">
                          </div>
                        </div>

                        <span class="text-sm w-10 text-center">
                          {{ project.progressPercentage }}%
                        </span>

                        <button
                          class="btn-ghost p-1"
                          (click)="changeProgress(project, 5)">
                          +
                        </button>

                      </div>
                    </td>

                    <!-- PARTENAIRE -->
                    <td class="text-sm text-neutral-500">
                      {{ project.partner || '-' }}
                    </td>

                    <!-- ACTIONS -->
                    <td class="text-right">
                      <button (click)="editProject(project)" class="btn-ghost p-2">
                        Edit
                      </button>

                      <button (click)="deleteProject(project)" class="btn-ghost p-2 text-red-500">
                        Delete
                      </button>
                    </td>

                  </tr>
                }
              </tbody>

            </table>
          </div>
        }

      </div>

      <!-- MODAL -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-xl w-full max-w-2xl">

            <h2 class="text-xl font-semibold mb-4">
              {{ editingProject() ? 'Modifier' : 'Nouveau' }} projet
            </h2>

            <form (ngSubmit)="saveProject()" class="space-y-4">

              <input class="input" [(ngModel)]="form.name" name="name" placeholder="Nom">

              <textarea class="input" [(ngModel)]="form.description" name="description"></textarea>

              <input class="input" type="number"
                [(ngModel)]="form.progressPercentage"
                name="progressPercentage"
                min="0" max="100">

              <div class="flex justify-end gap-2">
                <button type="button" (click)="closeModal()">Annuler</button>
                <button type="submit">Sauvegarder</button>
              </div>

            </form>

          </div>
        </div>
      }

    </div>
  `
})
export class AdminProjectsComponent implements OnInit {

  projects = signal<Project[]>([]);
  loading = signal(true);
  showModal = signal(false);
  editingProject = signal<Project | null>(null);
  saving = signal(false);

  form: any = {
    name: '',
    description: '',
    status: ProjectStatus.PLANIFIE,
    progressPercentage: 0,
    startDate: '',
    endDate: '',
    partner: '',
    budget: 0
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.apiService.getAllProjects(0, 50).subscribe({
      next: (res) => {
        if (res.success) this.projects.set(res.data.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  /* =========================
     🚀 PROGRESSION UPDATE
  ========================== */
  changeProgress(project: Project, delta: number): void {

    let newProgress = (project.progressPercentage || 0) + delta;

    if (newProgress < 0) newProgress = 0;
    if (newProgress > 100) newProgress = 100;

    const updated = {
      ...project,
      progressPercentage: newProgress
    };

    this.apiService.updateProject(project.id, updated).subscribe({
      next: (res) => {
        if (res.success) {

          // mise à jour UI sans reload
          const updatedList = this.projects().map(p =>
            p.id === project.id
              ? { ...p, progressPercentage: newProgress }
              : p
          );

          this.projects.set(updatedList);
        }
      }
    });
  }

  /* =========================
     CRUD EXISTANT
  ========================== */

  openModal(): void {
    this.showModal.set(true);
    this.editingProject.set(null);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  editProject(project: Project): void {
    this.editingProject.set(project);

    this.form = {
      ...project
    };

    this.showModal.set(true);
  }

  saveProject(): void {
    const editing = this.editingProject();

    const request = editing
      ? this.apiService.updateProject(editing.id, this.form)
      : this.apiService.createProject(this.form);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadProjects();
          this.closeModal();
        }
      }
    });
  }

  deleteProject(project: Project): void {
    if (confirm('Supprimer ce projet ?')) {
      this.apiService.deleteProject(project.id).subscribe({
        next: () => this.loadProjects()
      });
    }
  }

  /* =========================
     UTILS
  ========================== */

  getStatusLabel(status: string): string {
    const map: any = {
      PLANIFIE: 'Planifié',
      EN_COURS: 'En cours',
      SUSPENDU: 'Suspendu',
      TERMINE: 'Terminé',
      ANNULE: 'Annulé'
    };
    return map[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const map: any = {
      PLANIFIE: 'badge-accent',
      EN_COURS: 'badge-primary',
      SUSPENDU: 'badge-warning',
      TERMINE: 'badge-success',
      ANNULE: 'badge-error'
    };
    return map[status] || 'badge';
  }
}