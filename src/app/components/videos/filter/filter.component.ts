import { Component, OnInit, NgZone, AfterContentInit } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service';
import { Filter } from '../../../models/filter';
import { VideoService } from '../../../services/video.service';
import { OptionService } from '../../../services/option.service';
import { ActorService } from '../../../services/actor.service';
import { TagService } from '../../../services/tag.service';

declare var jQuery: any;

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit, AfterContentInit {

    filter: Filter;
    actorsSuggestion: string[];
    tagsSuggestion: string[];

    constructor(private electronService: ElectronService,
        private videoService: VideoService,
        private optionService: OptionService,
        private actorService: ActorService,
        private tagService: TagService,
        private ngZone: NgZone) {
        actorService.actors$.subscribe(actors => this.actorsSuggestion = actors.map(actor => actor.name));
        tagService.tags$.subscribe(tags => this.tagsSuggestion = tags.map(tag => tag.name));
        electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
            this.ngZone.run(() => {
                this.findVideos();
            });
        });
    }

    ngOnInit() {
        this.initFilter();
        this.findVideos();
        this.refreshActorsSuggestion();
        this.refreshTagsSuggestion();
    }

    private refreshActorsSuggestion() {
        this.actorService.refreshActors();
    }

    private refreshTagsSuggestion() {
        this.tagService.refreshTags();
    }

    private initFilter() {
        this.filter = this.optionService.findByName('filter');
        if (!this.filter) {
            this.filter = {};
        }
        if (!this.filter.actors) {
            this.filter.actors = [];
        }
        if (!this.filter.tags) {
            this.filter.tags = [];
        }
    }

    ngAfterContentInit() {
        this.initRatingRange();
    }

    initRatingRange() {

        const __this = this;

        const filterInput = jQuery('.filter .input-range');
        filterInput.asRange({
            range: true,
            tip: {
              active: 'onMove'
            }
        });

        jQuery('.filter .rating .asRange-pointer').on('asRange::moveEnd', function(event, element, i) {
            __this.filter.ratingRange = filterInput.val().split(',');
            __this.findVideos();
        });

    }

    findVideos() {
        const videos = this.videoService.findByFilter(this.filter);
        this.videoService.setVideos(videos);
        this.saveFilter();
    }

    onArrange(order: string) {
        this.filter.order = order;
        this.findVideos();
    }

    addActor(event) {
        this.filter.actors.push(event.value);
        this.findVideos();
    }

    removeActor(event) {
        const index = this.filter.actors.indexOf(event.value);
        this.filter.actors.splice(index, 1);
        this.findVideos();
    }

    addTag(event) {
        this.filter.tags.push(event.value);
        this.findVideos();
    }

    removeTag(event) {
        const index = this.filter.tags.indexOf(event.value);
        this.filter.tags.splice(index, 1);
        this.findVideos();
    }

    saveFilter() {
        this.optionService.createOrUpdate('filter', this.filter);
    }

}
