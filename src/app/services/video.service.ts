import { Injectable } from '@angular/core';
import { Video } from '../models/video';
import { ElectronService } from '../providers/electron.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { Filter } from '../models/filter';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    private videoEditionSource = new Subject<Video>();
    videoEdition$ = this.videoEditionSource.asObservable();

    private videosSource = new Subject<Video[]>();
    videos$ = this.videosSource.asObservable();

    constructor(public electronService: ElectronService) { }

    findByLibraryId(libraryId: number) {
        const videos = <Video[]> this.electronService.ipcRenderer.sendSync('videos:find', { libraryId });
        _.each(videos, video => this.setBackgroundVideo(video));
        return videos;
    }

    findByFilter(filter: Filter) {
        const videos = <Video[]> this.electronService.ipcRenderer.sendSync('videos:findByFilter', filter);
        _.each(videos, video => this.setBackgroundVideo(video));
        return videos;
    }

    findByIdFetch(id: number) {
        return this.electronService.ipcRenderer.sendSync('videos:findByIdFetch', id);
    }

    setBackgroundVideo(video: Video) {
        // video.cover = undefined;
        video.background = video.cover !== undefined
          ? 'url("file://' + video.cover.split('\\').join('/') + '") center center / cover no-repeat'
          : 'black';
    }

    setVideoEdition(video: Video) {
        let videoFetch = null;
        if (video) {
            videoFetch = this.findByIdFetch(video.id);
        }
        this.videoEditionSource.next(videoFetch);
    }

    setVideos(videos: Video[]) {
        this.videosSource.next(videos);
    }

    update(video: Video): Video {
        return this.electronService.ipcRenderer.sendSync('videos:update', video);
    }

}
