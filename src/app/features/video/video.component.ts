import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Video } from "../../core/models/event.model";
@Component({
    selector: "app-video",
    imports: [CommonModule],
    templateUrl: "./video.component.html",
    styleUrls: ["./video.component.scss"],
})
export class VideoComponent { 
    private readonly API_URL = "http://localhost:3000"; // Remplacez par l'URL de votre API

    videos: any[] = [];
    loading = false;
    video = signal<Video[]>([]);
    constructor() {
        this.loadVideos();
    }

    loadVideos() {
        this.loading = true;
        fetch(`${this.API_URL}/videos`)
            .then((response) => response.json())
            .then((data) => {
                this.video.set(data);
                this.loading = false;
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des vidéos:", error);
                this.loading = false;
            });
    }

    trackById(index: number, video: any): number {
        return video.id;
    }
}