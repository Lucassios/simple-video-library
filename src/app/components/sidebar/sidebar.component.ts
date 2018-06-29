import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { VideoLibraryService } from '../../services/video-library.service';
import { Video } from '../../models/video';
import { VideoService } from '../../services/video.service';
import { VideoLibrary } from '../../models/video-library';
import { Actor } from '../../models/actor';
import { ActorService } from '../../services/actor.service';
import { Tag } from '../../models/tag';
import { TagService } from '../../services/tag.service';
import { Producer } from '../../models/producer';
import { ProducerService } from '../../services/producer.service';

declare var jQuery: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

    videoEdition: Video;
    libraries: VideoLibrary[];
    actors: Actor[];
    tags: Tag[];
    producers: Producer[];

    constructor(private electronService: ElectronService,
        private videoLibraryService: VideoLibraryService,
        private videoService: VideoService,
        private tagService: TagService,
        private actorService: ActorService,
        private producerService: ProducerService) {
        videoService.videoEdition$.subscribe(video => this.videoEdition = video);
    }

    ngOnInit() {
        this.libraries = this.videoLibraryService.findAll();
        this.actors = this.actorService.findAll();
        this.tags = this.tagService.findAll();
        this.producers = this.producerService.findAll();
    }

    ngAfterViewChecked() {
        jQuery('.menu').tree();
    }

    onRefreshLibrary() {
        this.videoLibraryService.refreshLibraries();
    }

}
