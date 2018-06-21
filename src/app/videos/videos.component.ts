import { Component, OnInit } from '@angular/core';
import { Video } from '../models/video';
import { VideoLibrary } from '../models/video-library';
import { VideoService } from '../services/video.service';
import { ElectronService } from '../providers/electron.service';

declare var jQuery: any;

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html'
})
export class VideosComponent implements OnInit {

  videos: Video[] = [];
  library: VideoLibrary;

  constructor(public videoService: VideoService, public electronService: ElectronService) { }

  ngOnInit() {

    this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
      jQuery('#modal-loading').modal('hide');
    });

    this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:next', (event, video) => {
      jQuery('#modal-loading').find('.loading-info').html('<img src="' + video.cover + '" alt=""><br/>' + video.name);
    });

  }

  ngAfterContentInit() {
    this.library = { id: 1, name: '' };
    this.videos = this.videoService.findByLibraryId(this.library.id);
  }

}
