import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {

    constructor(private modalService: ModalService) { }

    ngOnInit() {
    }

    ngAfterViewChecked() {
        this.modalService.init();
    }

}
