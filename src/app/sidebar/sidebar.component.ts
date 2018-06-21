import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { VideoLibraryService } from '../services/video-library.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  constructor(public electronService: ElectronService,
    public videoLibraryService: VideoLibraryService) { }

  ngOnInit() {

  }

  onRefreshLibrary() {
    this.videoLibraryService.refreshLibraries();
  }

}
