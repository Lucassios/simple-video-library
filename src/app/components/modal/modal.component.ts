import { Component, OnInit, NgZone } from '@angular/core';
import { ModalState } from '../../models/modal-state';
import { ModalService } from '../../services/modal.service';

declare var jQuery: any;

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {

    modal: any;
    state: ModalState;
    showModal: boolean = false;

    constructor(private modalService: ModalService,
        private ngZone: NgZone) {
        this.state = { show: false };
        modalService.modalState$.subscribe(state => this.setNewState(state));
    }

    ngOnInit() {
        
    }

    ngAfterViewChecked() {
        this.modal = jQuery('#modal');
    }

    setNewState(newState: ModalState) {
        if (newState.show && !this.showModal) {
            this.show();
        } else if (!newState.show && this.showModal) {
            this.close();
        }
        this.showModal = newState.show;
        this.ngZone.run(() => this.state = newState);
    }

    show() {
        this.modal.modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    close() {
        this.modal.on('shown.bs.modal', () => {
            if (!this.showModal) {
                this.modal.modal('hide');
            }
        });
        this.modal.modal('hide');
    }

}
