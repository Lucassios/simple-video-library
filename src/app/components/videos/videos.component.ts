import { Component, OnInit, NgZone, HostListener, ViewChild } from '@angular/core';
import { Video } from '../../models/video';
import { VideoLibrary } from '../../models/video-library';
import { VideoService } from '../../services/video.service';
import { ElectronService } from '../../providers/electron.service';
import { FilterComponent } from './filter/filter.component';

declare var jQuery: any;

@Component({
    selector: 'app-videos',
    templateUrl: './videos.component.html'
})
export class VideosComponent implements OnInit {

    videos: Video[] = [];
    videosSelected: Video[] = [];
    library: VideoLibrary;

    keyCtrlPressed: boolean = false;

    @ViewChild(FilterComponent)
    private filterComponent: FilterComponent;

    constructor(private videoService: VideoService,
        private electronService: ElectronService) {
        videoService.videos$.subscribe(videos => this.videos = videos);
    }

    ngOnInit() {
    }

    ngAfterContentInit() {

    }

    onDblClickVideo(video) {
        this.clearSelectedVideos();
        this.selectVideo(video);
        this.videoService.openFile(video);
        video.new = false;
        this.videoService.update(video);
    }

    selectVideo(video) {
        video.selected = true;
        this.videosSelected.push(video);
        this.videoService.setVideoEdition(video);
    }

    unSelectVideo(video) {
        video.selected = false;
        this.videoService.setVideoEdition(null);
    }

    onClickVideo(event, video: Video) {
        let selected = video.selected;
        if (!this.keyCtrlPressed) {
            this.clearSelectedVideos();
        }
        this.selectVideo(video);
    }

    clearSelectedVideos() {
        this.videosSelected.forEach(video => video.selected = false);
        this.videosSelected = [];
    }

    onRateVideo(video: Video) {
        this.videoService.update(video);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyupEvent(event: KeyboardEvent) {
        if(event.key === 'Control') {
            this.keyCtrlPressed = true;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeydownEvent(event: KeyboardEvent) {
        if(event.key === 'Delete') {
            if (this.videosSelected.length > 0) {
                if (confirm('Are you sure you want to delete those files from your disk?')) {
                    this.videosSelected.forEach(video => this.videoService.delete(video));
                    this.filterComponent.findVideos();
                }
            }
        } else if (event.key === 'Control') {
            this.keyCtrlPressed = false;
        }
    }

    @HostListener('document:click', ['$event'])
    clickedOutside(event: MouseEvent) {

        const videoEditionElement = <HTMLInputElement> document.getElementsByClassName('video-edition')[0];
        const targetElement = event.target as HTMLElement;
        const elementClass = targetElement.getAttribute('class');

        if ((!elementClass || elementClass.indexOf('video') < 0) && !videoEditionElement.contains(targetElement)) {
            this.clearSelectedVideos();
            this.videoService.setVideoEdition(null);
        }

    }

    onContextMenu(event: MouseEvent, video: Video): void {
        this.clearSelectedVideos();
        this.selectVideo(video);
    }

    showInFolder(video: Video) {
        this.videoService.showInFolder(video);
    }

}
