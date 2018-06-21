import { Component, OnInit } from '@angular/core';
import { Video } from '../models/video';
import { VideoLibrary } from '../models/video-library';
import { VideoService } from '../services/video.service';
import { ElectronService } from '../providers/electron.service';
import { VideoLibraryService } from '../services/video-library.service';

declare var jQuery: any;

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html'
})
export class VideosComponent implements OnInit {

  videos: Video[] = [];
  library: VideoLibrary;

  constructor(public videoService: VideoService,
    public electronService: ElectronService,
    public videoLibraryService: VideoLibraryService) { }

  ngOnInit() {

    this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
      jQuery('#modal-loading').modal('hide');
    });

    this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:next', (event, video) => {
      jQuery('#modal-loading').find('.loading-info').html('<img src="' + video.cover + '" alt=""><br/>' + video.name);
    });

  }

  ngAfterContentInit() {
    let libraries = this.videoLibraryService.findAll();
    if (libraries && libraries.length > 0) {
      this.videos = this.videoService.findByLibraryId(libraries[0].id);
    }
  }

}
