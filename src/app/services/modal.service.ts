import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalState } from '../models/modal-state';

declare var jQuery: any;

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private modalStateSource = new Subject<ModalState>();
    modalState$ = this.modalStateSource.asObservable();

    private modalState: ModalState;

    constructor() {
        this.modalState = { show: false };
    }

    setTitle(title: string) {
        this.modalState.title = title;
        this.modalStateSource.next(this.modalState);
    }

    setBody(body: string) {
        this.modalState.body = body;
        this.modalStateSource.next(this.modalState);
    }

    setProgressBar(progressPercentage: number) {
        this.modalState.progressPercentage = progressPercentage;
        this.modalStateSource.next(this.modalState);
    }

    show(title: string) {
        this.modalState.show = true;
        this.modalState.title = title;
        this.modalStateSource.next(this.modalState);
    }

    close() {
        this.modalState = { show: false };
        this.modalStateSource.next(this.modalState);
    }
    
}
