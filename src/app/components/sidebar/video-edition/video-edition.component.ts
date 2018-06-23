import { Component, OnInit, Input } from '@angular/core';
import { Video } from '../../../models/video';
import { VideoService } from '../../../services/video.service';
import { ActorService } from '../../../services/actor.service';
import {Actor} from '../../../models/actor';

@Component({
    selector: 'app-video-edition',
    templateUrl: './video-edition.component.html'
})
export class VideoEditionComponent implements OnInit {

    @Input() video: Video;

    constructor(public videoService: VideoService,
        public actorService: ActorService) { }

    ngOnInit() {
    }

    onVideoEditionNameBlur(event) {
        console.log('updating video...');
        this.video.name = event.target.value;
        this.videoService.update(this.video);
    }

    addActor(event) {
        const actor = this.actorService.createOrUpdate({ name: <string> event.value }, this.video);
        if (!this.video.actors) {
            this.video.actors = [];
        }
        this.video.actors.push(actor);
    }

    removeActor(actor: Actor) {
        this.actorService.remove(actor, this.video);
    }

}
