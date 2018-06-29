import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { Observable, fromEvent, timer } from 'rxjs';
import { map, filter, scan, debounce, distinctUntilChanged } from 'rxjs/operators';
import { OptionService } from '../../services/option.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    search: string;
    @ViewChild('searchRef') searchInputRef: ElementRef;

    constructor(private videoService: VideoService,
        private optionService: OptionService) { }

    ngOnInit() {

        const filter = this.optionService.findByName('filter');
        if (filter) {
            this.search = filter.search;
        }

        fromEvent(this.searchInputRef.nativeElement, 'keyup')
        .pipe(
            map((evt: any) => evt.target.value),
            debounce(() => timer(500)),
            distinctUntilChanged()
        )
        .subscribe((text: string) => this.videoService.setSearch(text));

    }

}
