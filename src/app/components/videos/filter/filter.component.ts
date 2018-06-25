import { Component, OnInit, NgZone, AfterContentInit } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service';
import { Filter } from '../../../models/filter';
import { VideoService } from '../../../services/video.service';
import { OptionService } from '../../../services/option.service';
import { ActorService } from '../../../services/actor.service';

declare var jQuery: any;

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit, AfterContentInit {

    filter: Filter;
    actorsSuggestion: string[];

    constructor(private electronService: ElectronService,
        private videoService: VideoService,
        private optionService: OptionService,
        private actorService: ActorService,
        private ngZone: NgZone) {
        this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
            this.ngZone.run(() => {
                this.findVideos();
            });
        });
    }

    ngOnInit() {
        this.initFilter();
        this.findVideos();
        this.findActorsSuggestion();
    }

    private findActorsSuggestion() {
        this.actorsSuggestion = this.actorService.findAll().map(actor => actor.name);
    }

    private initFilter() {
        this.filter = this.optionService.findByName('filter');
        if (!this.filter) {
            this.filter = {};
        }
        if (!this.filter.actors) {
            this.filter.actors = [];
        }
    }

    ngAfterContentInit() {
        this.initRatingRange();
    }

    initRatingRange() {

        const _this = this;

        const filterInput = jQuery('.filter .input-range');
        filterInput.asRange({
            range: true,
            tip: {
              active: 'onMove'
            }
        });

        jQuery('.filter .rating .asRange-pointer').on('asRange::moveEnd', function(event, element, i) {
            _this.filter.ratingRange = filterInput.val().split(',');
            _this.findVideos();
        });

    }

    findVideos() {
        const videos = this.videoService.findByFilter(this.filter);
        this.videoService.setVideos(videos);
    }

    onArrange(order: string) {
        this.filter.order = order;
        this.optionService.createOrUpdate('filter', this.filter);
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

}
