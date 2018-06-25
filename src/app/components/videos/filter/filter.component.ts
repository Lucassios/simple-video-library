import { Component, Input, OnInit, NgZone } from '@angular/core';
import { Video } from '../../../models/video';
import { ElectronService } from '../../../providers/electron.service';
import { Filter } from '../../../models/filter';
import { VideoService } from '../../../services/video.service';
import { OptionService } from '../../../services/option.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {

    filter: Filter;

    constructor(private electronService: ElectronService,
        private videoService: VideoService,
        private optionService: OptionService,
        private ngZone: NgZone) {
        this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
            this.ngZone.run(() => {
                this.findVideos();
            });
        });
    }

    ngOnInit() {
        this.filter = this.optionService.findByName('filter');
        if (!this.filter) {
            this.filter = {};
        }
        console.log(this.filter);
        this.findVideos();
    }

    findVideos() {
        let videos = this.videoService.findByFilter(this.filter);
        this.videoService.setVideos(videos);
    }

    onArrange(order: string) {
        this.filter.order = order;
        this.optionService.createOrUpdate('filter', this.filter);
        this.findVideos();
    }

}
