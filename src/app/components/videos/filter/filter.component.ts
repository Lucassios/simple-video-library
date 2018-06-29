import { Component, OnInit, NgZone, AfterContentInit } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service';
import { Filter } from '../../../models/filter';
import { VideoService } from '../../../services/video.service';
import { OptionService } from '../../../services/option.service';
import { ActorService } from '../../../services/actor.service';
import { TagService } from '../../../services/tag.service';
import { ProducerService } from '../../../services/producer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoLibraryService } from '../../../services/video-library.service';

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
            var libraryId = map.get('libraryId');
            if (libraryId) {
                this.filter.libraryId = parseInt(libraryId);
                this.findVideos();
            }
            else {
                const library = this.videoLibraryService.findFirst();
                if (library) {
                    this.router.navigate(['/videos/library/', 1]);
                }
            }
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
