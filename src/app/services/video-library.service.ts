import { Injectable } from '@angular/core';
import { VideoLibrary } from '../models/video-library';
import { ElectronService } from '../providers/electron.service';

declare var jQuery: any;

@Injectable({
  providedIn: 'root'
})
export class VideoLibraryService {

  constructor(public electronService: ElectronService) {
    
    this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
      jQuery('#modal-loading').modal('hide');
    });

    this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:next', (event, video) => {
      jQuery('#modal-loading').find('.loading-info').html('<img src="' + video.cover + '" alt=""><br/>' + video.name);
    });

  }

  create(videoLibrary: VideoLibrary): VideoLibrary {
    return this.electronService.ipcRenderer.sendSync('videoLibraries:insert', videoLibrary);
  }

  update(videoLibrary: VideoLibrary): VideoLibrary {
    return this.electronService.ipcRenderer.sendSync('videoLibraries:update', videoLibrary);
  }

  findAll(options?): VideoLibrary[] {
    if (options == undefined) {
      return this.electronService.ipcRenderer.sendSync('videoLibraries:findAll');
    } else {
      return this.electronService.ipcRenderer.sendSync('videoLibraries:findAll', options);
    }
  }

  remove(videoLibrary: VideoLibrary): number {
    return this.electronService.ipcRenderer.sendSync('videoLibraries:remove', videoLibrary);
  }

  refreshLibraries(): any {
    let libraries = this.findAll();
    if (libraries && libraries.length > 0) {
      this.electronService.ipcRenderer.send('videoLibraries:refreshLibrary', libraries[0]);
      jQuery('#modal-loading').modal({
        backdrop: 'static',
        keyboard: false
      });
    }
  }

}
