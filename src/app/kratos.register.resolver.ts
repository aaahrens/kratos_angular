import {Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';
import {KRATOS_REGISTER_CONFIGS} from '../../tokens';
import {RequestMethodConfig} from '../../typings';

const KRATOS_REGISTER_CONFIGS_STATE_KEY  = makeStateKey<RequestMethodConfig>('kratos-register-state');

@Injectable()
export class KratosRegisterResolver implements Resolve<RequestMethodConfig> {
  constructor(private transferState: TransferState,
              @Inject(PLATFORM_ID) private platformId,
              @Optional() @Inject(KRATOS_REGISTER_CONFIGS) private configs: any) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (this.transferState.hasKey<string>(KRATOS_REGISTER_CONFIGS)) {
      const storedConfigs = this.transferState.get<RequestMethodConfig>(KRATOS_REGISTER_CONFIGS, null);
      return of(storedConfigs);
    } else {
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(KRATOS_REGISTER_CONFIGS, this.configs);
      }
      return of(this.configs);
    }
  }
}
