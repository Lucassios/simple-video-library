import { Component, OnInit, Input } from '@angular/core';
import { Video } from '../../../models/video';
import { VideoService } from '../../../services/video.service';
import { ActorService } from '../../../services/actor.service';
import { Actor } from '../../../models/actor';
import { TagService } from '../../../services/tag.service';
import { Tag } from '../../../models/tag';

@Component({
    selector: 'app-video-edition',
    templateUrl: './video-edition.component.html'
})
export class VideoEditionComponent implements OnInit {

    @Input() video: Video;
    actorsSuggestion: string[];
    tagsSuggestion: string[];

    constructor(private videoService: VideoService,
        private actorService: ActorService,
        private tagService: TagService) { }

    ngOnInit() {
        this.findActorsSuggestion();
        this.findTagsSuggestion();
    }

    onVideoEditionNameBlur(event) {
        this.video.name = event.target.value;
        this.videoService.update(this.video);
    }

    addActor(event) {
        const actor = this.actorService.createOrUpdate({ name: <string> event.value }, this.video);
        if (!this.video.actors) {
            this.video.actors = [];
        }
        this.video.actors.push(actor);
        this.findActorsSuggestion();
    }

    removeActor(actor: Actor) {
        this.actorService.remove(actor, this.video);
        this.findActorsSuggestion();
    }

    addTag(event) {
        const tag = this.tagService.createOrUpdate({ name: <string> event.value }, this.video);
        if (!this.video.tags) {
            this.video.tags = [];
        }
        this.video.tags.push(tag);
        this.findActorsSuggestion();
    }

    removeTag(tag: Tag) {
        this.tagService.remove(tag, this.video);
        this.findTagsSuggestion();
    }

    private findActorsSuggestion() {
        this.actorsSuggestion = this.actorService.findAll().map(actor => actor.name);
    }

    private findTagsSuggestion() {
        this.tagsSuggestion = this.tagService.findAll().map(tag => tag.name);
    }

}
