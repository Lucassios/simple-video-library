import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../providers/electron.service';

declare var jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  constructor(public electronService: ElectronService) { }

  ngOnInit() {

    this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:end', (event, videos) => {
      jQuery('#modal-loading').modal('hide');
    });

    this.electronService.ipcRenderer.on('videoLibraries:refreshLibrary:next', (event, video) => {
      jQuery('#modal-loading').find('.loading-info').html('<img src="' + video.cover + '" alt=""><br/>' + video.name);
    });

  }

  onRefreshLibrary() {
    console.log('onRefreshLibrary...');
    // this.loadingModal.modal({
    //   backdrop: 'static',
    //   keyboard: false
    // });
    this.electronService.ipcRenderer.send('videoLibraries:refreshLibrary', {id: 1});
    jQuery('#modal-loading').modal({
      backdrop: 'static',
      keyboard: false
    });
  }

}
