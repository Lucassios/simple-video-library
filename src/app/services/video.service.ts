import { Injectable } from '@angular/core';
import { Video } from '../models/video';
import { ElectronService } from '../providers/electron.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  videos: Video[] = [];

  constructor(public electronService: ElectronService) { }

  findByLibraryId(libraryId: number) {
    this.videos = <Video[]> this.electronService.ipcRenderer.sendSync('videos:find', { libraryId });
    _.each(this.videos, video => this.setBackgroundVideo(video));
    // this.videos = this.shuffleArray(this.videos);
    return this.videos;
  }

  setBackgroundVideo(video: Video) {
    video.background = video.cover != undefined ? 'url(' + video.cover.split('\\').join('/') + ') center center / cover no-repeat' : 'black';
  }

}
