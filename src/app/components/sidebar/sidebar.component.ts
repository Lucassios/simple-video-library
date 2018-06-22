import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { VideoLibraryService } from '../../services/video-library.service';
import { Video } from '../../models/video';
import { VideoService } from '../../services/video.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

    videoEdition: Video;

    constructor(public electronService: ElectronService,
        public videoLibraryService: VideoLibraryService,
        public videoService: VideoService) {
        videoService.videoEdition$.subscribe(video => this.videoEdition = video);
    }

    ngOnInit() {

    }

    onRefreshLibrary() {
        this.videoLibraryService.refreshLibraries();
    }

}
