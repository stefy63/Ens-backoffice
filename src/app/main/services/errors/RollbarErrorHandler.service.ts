import { Injectable, ErrorHandler } from '@angular/core';
import * as Rollbar from 'rollbar';
import { environment } from '../../../../environments/environment';

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
    private rollbar: Rollbar;

    constructor() {
        this.rollbar = new Rollbar(environment.rollbar);
    }

    handleError(err) {
        if (environment.HANDLE_ERROR) {
            this.rollbar.error(err.originalError || err);
        }
    }
}
