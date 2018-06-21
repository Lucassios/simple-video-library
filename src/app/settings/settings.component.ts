import { Component, OnInit, NgZone } from '@angular/core';
import { VideoLibrary } from '../models/video-library';
import { VideoLibraryService } from '../services/video-library.service';
import { ElectronService } from '../providers/electron.service';
import { VideoLibraryPathService } from '../services/video-library-path.service';
import { VideoLibraryPath } from '../models/video-library-path';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  videoLibraries : VideoLibrary[];
  videoLibrary = new VideoLibrary();

  constructor(public videoLibraryService: VideoLibraryService,
    public electronService: ElectronService,
    public videoLibraryPathService: VideoLibraryPathService,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.findVideoLibraries();
  }

  onSaveLibrary() {
    if (this.videoLibrary.id != undefined) {
      this.videoLibraryService.update(this.videoLibrary);
    } else {
      this.videoLibraryService.create(this.videoLibrary);
    }
    this.videoLibrary = new VideoLibrary();
    this.findVideoLibraries();
  }

  onRemoveLibrary(videoLibrary: VideoLibrary) {
    this.videoLibraryService.remove(videoLibrary);
    this.findVideoLibraries();
  }

  findVideoLibraries() {
    this.videoLibraries = this.videoLibraryService.findAll();
  }

  onAddFolder(videoLibrary: VideoLibrary) {
    this.electronService.remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    }, (paths) => {
      if (videoLibrary.paths == undefined) {
        videoLibrary.paths = [];
      }
      this.ngZone.run(() => {
        videoLibrary.paths.push(...this.videoLibraryPathService.createAll(paths, videoLibrary));
      });
    });
  }

  onRemovePath(videoLibrary: VideoLibrary, videoLibraryPath: VideoLibraryPath, index: number) {
    this.videoLibraryPathService.remove(videoLibraryPath);
    videoLibrary.paths.splice(index, 1);
  }

}
