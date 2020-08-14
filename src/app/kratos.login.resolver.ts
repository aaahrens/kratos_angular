import {Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';
import {KRATOS_LOGIN_CONFIGS} from '../../tokens';

const KRATOS_LOGIN_CONFIGS_STATE_KEY  = makeStateKey<any>('meow meow');
@Injectable()
export class KratosLoginResolver implements Resolve<any> {
  constructor(private transferState: TransferState,
              @Inject(PLATFORM_ID) private platformId,
              @Optional() @Inject(KRATOS_LOGIN_CONFIGS) private configs: any) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (this.transferState.hasKey<string>(KRATOS_LOGIN_CONFIGS_STATE_KEY)) {
      const storedConfigs = this.transferState.get<any>(KRATOS_LOGIN_CONFIGS_STATE_KEY, null);
      return of(storedConfigs);
    } else {
      if (isPlatformServer(this.platformId)) {
        this.transferState.set(KRATOS_LOGIN_CONFIGS_STATE_KEY, this.configs);
      }
      return of(this.configs);
    }
  }
}
