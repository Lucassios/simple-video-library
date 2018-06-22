import { Injectable } from '@angular/core';
import { Video } from '../models/video';
import { ElectronService } from '../providers/electron.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    videos: Video[] = [];

    private videoEditionSource = new Subject<Video>();
    videoEdition$ = this.videoEditionSource.asObservable();

    constructor(public electronService: ElectronService) { }

    findByLibraryId(libraryId: number) {
        this.videos = <Video[]> this.electronService.ipcRenderer.sendSync('videos:find', { libraryId });
        _.each(this.videos, video => this.setBackgroundVideo(video));
        // this.videos = this.shuffleArray(this.videos);
        return this.videos;
    }

    setBackgroundVideo(video: Video) {
        video.background = video.cover !== undefined ? 'url("file://' + video.cover.split('\\').join('/') + '") center center / cover no-repeat' : 'black';
    }

    setVideoEdition(video: Video) {
        this.videoEditionSource.next(video);
    }

    update(video: Video): Video {
        return this.electronService.ipcRenderer.sendSync('videos:update', video);
    }

}
