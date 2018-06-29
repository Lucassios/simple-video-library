import { Component, OnInit, NgZone, AfterContentInit } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service';
import { Filter } from '../../../models/filter';
import { VideoService } from '../../../services/video.service';
import { OptionService } from '../../../services/option.service';
import { ActorService } from '../../../services/actor.service';
import { TagService } from '../../../services/tag.service';
import { ProducerService } from '../../../services/producer.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { VideoLibraryService } from '../../../services/video-library.service';
import * as _ from 'lodash';

declare var jQuery: any;

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit, AfterContentInit {

    filter: Filter;
    actorsSuggestion: string[];
    tagsSuggestion: string[];
    producersSuggestion: string[];

    paramMap: ParamMap;

    constructor(private electronService: ElectronService,
        private videoService: VideoService,
        private videoLibraryService: VideoLibraryService,
        private optionService: OptionService,
        private actorService: ActorService,
        private tagService: TagService,
        private producerService: ProducerService,
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone) {

        this.subscribeToInternalEvents();
        this.initFilter();
        this.subscribeToRouteParameters();
        this.subscribeToBackendEvents(electronService);

    }

    private subscribeToInternalEvents() {
        this.actorService.actors$.subscribe(actors => this.actorsSuggestion = actors.map(actor => actor.name));
        this.tagService.tags$.subscribe(tags => this.tagsSuggestion = tags.map(tag => tag.name));
        this.producerService.producers$.subscribe(producers => this.producersSuggestion = producers.map(producer => producer.name));
        this.videoService.search$.subscribe(search => { this.filter.search = search; this.findVideos(); });
    }

    private subscribeToBackendEvents(electronService: ElectronService) {
        electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
            this.ngZone.run(() => {
                this.findVideos();
            });
        });
    }

    private subscribeToRouteParameters() {
        this.route.paramMap.subscribe(map => {

            if (!map.has('libraryId') && !map.has('actorName') && !map.has('tagName')) {
                const library = this.videoLibraryService.findFirst();
                if (library) {
                    return this.router.navigate(['/videos/library/', 1]);
                }
            }

            this.paramMap = map;
            this.findVideos();

        });
    }

    ngOnInit() {
        this.refreshActorsSuggestion();
        this.refreshTagsSuggestion();
        this.refreshProducersSuggestion();
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
        if (!this.filter.producers) {
            this.filter.producers = [];
        }
    }

    private cleanFilter() {
        this.filter = {};
        this.filter.actors = [];
        this.filter.tags = [];
        this.filter.producers = [];
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

        // create temporary filter to insert routes params (shall not be persisted)
        const tempFilter = _.cloneDeep(this.filter);

        const libraryId = this.paramMap.get('libraryId');
        if (libraryId) {
            tempFilter.libraryId = parseInt(libraryId);
        }

        const actorName = this.paramMap.get('actorName');
        if (actorName) {
            tempFilter.actors.push(actorName);
        }

        const tagName = this.paramMap.get('tagName');
        if (tagName) {
            tempFilter.tags.push(tagName);
        }
        
        const videos = this.videoService.findByFilter(tempFilter);
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

    addProducer(event) {
        this.filter.producers.push(event.value);
        this.findVideos();
    }

    removeProducer(event) {
        const index = this.filter.producers.indexOf(event.value);
        this.filter.producers.splice(index, 1);
        this.findVideos();
    }

    saveFilter() {
        this.optionService.createOrUpdate('filter', this.filter);
    }

}
