import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { VideoLibrary } from '../models/video-library';
import { VideoLibraryPath } from '../models/video-library-path';
import { ElectronService } from '../providers/electron.service';

@Injectable({
  providedIn: 'root'
})
export class VideoLibraryPathService {

  constructor(public electronService: ElectronService) { }

  create(VideoLibraryPath: VideoLibraryPath): VideoLibraryPath {
    return this.electronService.ipcRenderer.sendSync('videoLibraryPaths:insert', VideoLibraryPath);
  }

  createAll(paths: string[], videoLibrary: VideoLibrary): VideoLibraryPath[] {
    let videoLibraryPaths = _.map(paths, path => this.create({ path, videolibraryId: videoLibrary.id }) );
    return _.compact(videoLibraryPaths);
  }

  remove(VideoLibraryPath: VideoLibraryPath): number {
    return this.electronService.ipcRenderer.sendSync('videoLibraryPaths:remove', VideoLibraryPath);
  }

}
