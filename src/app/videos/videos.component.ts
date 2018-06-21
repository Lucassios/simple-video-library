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
  }

  ngAfterContentInit() {
    const libraries = this.videoLibraryService.findAll();
    if (libraries && libraries.length > 0) {
      this.videos = this.videoService.findByLibraryId(libraries[0].id);
      if (this.videos.length > 0) {
        this.videos[0].selected = true;
      }
    }
  }

  onDblClickVideo(video) {
    this.electronService.ipcRenderer.send('videos:open', video);
  }

  onSelectVideo(event, video: Video) {
    video.selected = !video.selected;
    console.log(video.selected);
  }

}
