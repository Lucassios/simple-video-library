import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { VideoLibraryService } from '../../services/video-library.service';
import { Video } from '../../models/video';
import { VideoService } from '../../services/video.service';
import { VideoLibrary } from '../../models/video-library';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

    videoEdition: Video;
    libraries: VideoLibrary[];

    constructor(public electronService: ElectronService,
        public videoLibraryService: VideoLibraryService,
        public videoService: VideoService) {
        videoService.videoEdition$.subscribe(video => this.videoEdition = video);
    }

    ngOnInit() {
        this.libraries = this.videoLibraryService.findAll();
    }

    onRefreshLibrary() {
        this.videoLibraryService.refreshLibraries();
    }

}
