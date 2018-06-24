import {Component, Input, OnInit} from '@angular/core';
import {Video} from '../../../models/video';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {

    @Input() videos: Video[];

    constructor() { }

    ngOnInit() {
    }

}
