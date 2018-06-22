import { Component, OnInit, Input } from '@angular/core';
import { Video } from '../../../models/video';
import { VideoService } from '../../../services/video.service';

@Component({
    selector: 'app-video-edition',
    templateUrl: './video-edition.component.html'
})
export class VideoEditionComponent implements OnInit {

    @Input() video: Video;

    constructor(public videoService: VideoService) { }

    ngOnInit() {
    }

    onVideoEditionNameBlur(event) {
        console.log('updating video...');
        this.video.name = event.target.value;
        this.videoService.update(this.video);
    }

}
