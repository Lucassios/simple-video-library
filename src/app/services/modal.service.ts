import { Injectable, AfterViewInit } from '@angular/core';

declare var jQuery: any;

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private modal;
    private progressBar;

    constructor() { }

    init() {
        this.modal = jQuery('#modal');
        this.progressBar = jQuery('#modal .progress');
    }

    setTitle(title: string) {
        this.modal.find('.modal-title').html(title);
    }

    setBody(body: string) {
        this.modal.find('.modal-body .content').html(body);
    }

    setProgressBar(percentage: number) {
        this.progressBar.show()
            .html('<div class="progress-bar" role="progressbar" style="width: ' + percentage + '%" aria-valuenow="" aria-valuemin="0" aria-valuemax="100"></div>');
    }

    clean() {
        this.setTitle('');
        this.setBody('');
        this.progressBar.hide();
    }

    show(title: string) {
        this.setTitle(title);
        this.modal.modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    close() {
        this.clean();
        let _this = this;
        this.modal.on('shown.bs.modal', () => _this.modal.modal('hide'));
        this.modal.modal('hide');
    }
    
}
