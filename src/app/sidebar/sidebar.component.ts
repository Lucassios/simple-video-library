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
