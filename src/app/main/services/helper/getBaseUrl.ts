import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class GetBaseUrl {

    public static baseUrl(): any {
      const apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
      return environment.api_url + apiPort + environment.api_suffix;
    }

}

