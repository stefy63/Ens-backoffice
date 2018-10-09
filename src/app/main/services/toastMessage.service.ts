import { Injectable } from '@angular/core';
import { SweetAlertType } from 'sweetalert2';
import swal from 'sweetalert2';

@Injectable()
export class ToastMessage {
    success(title: string, text: string): Promise<ToastMessageResult> {
        return this.renderToastMessage(title, text, 'success');
    }
    error(title: string, text: string): Promise<ToastMessageResult> {
        return this.renderToastMessage(title, text, 'error');
    }
    warning(title: string, text: string): Promise<ToastMessageResult> {
        return this.renderToastMessage(title, text, 'warning');
    }
    info(title: string, text: string): Promise<ToastMessageResult> {
        return this.renderToastMessage(title, text, 'info');
    }

    private renderToastMessage(title: string, text: string, type: SweetAlertType): Promise<ToastMessageResult> {
        return swal({
            title: title,
            html: text,
            type: type,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Conferma',
            cancelButtonText: 'Annulla'
        });
    }
}

export interface ToastMessageResult {
    value?: any;
    dismiss?: any;
}
