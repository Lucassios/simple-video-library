import { Component, OnInit, NgZone, HostListener } from '@angular/core';
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
        private electronService: ElectronService) {
        videoService.videos$.subscribe(videos => this.videos = videos);
    }

    ngOnInit() {
    }

    ngAfterContentInit() {

    }

    onDblClickVideo(video) {
        this.onSelectVideo(null, video);
        this.electronService.ipcRenderer.send('videos:open', video);
        video.new = false;
        this.videoService.update(video);
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

    @HostListener('document:keyup', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        console.log(event.key);
        if(event.key === 'Delete')
        {
            console.log('delete pressed...');
        }
    }

}
