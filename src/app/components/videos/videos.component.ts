import { Component, OnInit, NgZone } from '@angular/core';
import { Video } from '../../models/video';
import { VideoLibrary } from '../../models/video-library';
import { VideoService } from '../../services/video.service';
import { ElectronService } from '../../providers/electron.service';
import { VideoLibraryService } from '../../services/video-library.service';

declare var jQuery: any;

@Component({
    selector: 'app-videos',
    templateUrl: './videos.component.html'
})
export class VideosComponent implements OnInit {

    videos: Video[] = [];
    videosSelected: Video[] = [];
    library: VideoLibrary;

    constructor(private videoService: VideoService,
        private electronService: ElectronService,
        private videoLibraryService: VideoLibraryService,
        private ngZone: NgZone) {
        this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
            this.ngZone.run(() => {
                this.findVideos();
            });
        });
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.findVideos();
    }

    findVideos() {
        console.log('finding videos...');
        const libraries = this.videoLibraryService.findAll();
        if (libraries && libraries.length > 0) {
            this.videos = this.videoService.findByLibraryId(libraries[0].id);
            console.log(this.videos);
        }
    }

    onDblClickVideo(video) {
        this.electronService.ipcRenderer.send('videos:open', video);
    }

    onSelectVideo(event, video: Video) {
        video.selected = !video.selected;
        this.clearSelectedVideos();
        if (video.selected) {
            this.videosSelected.push(video);
            this.videoService.setVideoEdition(video);
        } else {
            this.videoService.setVideoEdition(null);
        }
    }

    clearSelectedVideos() {
        this.videosSelected.forEach(video => video.selected = false);
        this.videosSelected = [];
    }

    onRateVideo(video: Video) {
        this.videoService.update(video);
    }

}
