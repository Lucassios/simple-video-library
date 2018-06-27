import { Component, OnInit, Input } from '@angular/core';
import { Video } from '../../../models/video';
import { VideoService } from '../../../services/video.service';
import { ActorService } from '../../../services/actor.service';
import { Actor } from '../../../models/actor';
import { TagService } from '../../../services/tag.service';
import { Tag } from '../../../models/tag';
import { ProducerService } from '../../../services/producer.service';
import { Producer } from '../../../models/producer';

@Component({
    selector: 'app-video-edition',
    templateUrl: './video-edition.component.html'
})
export class VideoEditionComponent implements OnInit {

    @Input() video: Video;
    actorsSuggestion: string[];
    tagsSuggestion: string[];
    producersSuggestion: string[];

    constructor(private videoService: VideoService,
        private actorService: ActorService,
        private tagService: TagService,
        private producerService: ProducerService) {
        actorService.actors$.subscribe(actors => this.actorsSuggestion = actors.map(actor => actor.name));
        tagService.tags$.subscribe(tags => this.tagsSuggestion = tags.map(tag => tag.name));
        producerService.producers$.subscribe(producers => this.producersSuggestion = producers.map(producer => producer.name));
    }

    ngOnInit() {
        this.refreshActorsSuggestion();
        this.refreshTagsSuggestion();
        this.refreshProducersSuggestion();
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
        this.refreshActorsSuggestion();
    }

    removeActor(actor: Actor) {
        this.actorService.remove(actor, this.video);
        this.refreshActorsSuggestion();
    }

    addTag(event) {
        const tag = this.tagService.createOrUpdate({ name: <string> event.value }, this.video);
        if (!this.video.tags) {
            this.video.tags = [];
        }
        this.video.tags.push(tag);
        this.refreshTagsSuggestion();
    }

    removeTag(tag: Tag) {
        this.tagService.remove(tag, this.video);
        this.refreshTagsSuggestion();
    }

    addProducer(event) {
        const producer = this.producerService.createOrUpdate({ name: <string> event.value }, this.video);
        if (!this.video.producers) {
            this.video.producers = [];
        }
        this.video.producers.push(producer);
        this.refreshProducersSuggestion();
    }

    removeProducer(producer: Producer) {
        this.producerService.remove(producer, this.video);
        this.refreshProducersSuggestion();
    }

    private refreshActorsSuggestion() {
        this.actorService.refreshActors();
    }

    private refreshTagsSuggestion() {
        this.tagService.refreshTags();
    }

    private refreshProducersSuggestion() {
        this.producerService.refreshProducers();
    }

}
