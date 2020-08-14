import 'zone.js/dist/zone-node';

import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {join} from 'path';
import * as proxy from 'http-proxy-middleware';
import {AppServerModule} from './src/main.server';
import {APP_BASE_HREF} from '@angular/common';
import {existsSync} from 'fs';
import {CommonApi, LoginRequest, RegistrationRequest} from '@oryd/kratos-client';
import {environment} from './src/environments/environment';
import {KRATOS_LOGIN_CONFIGS, KRATOS_REGISTER_CONFIGS} from './tokens';
import {Request, Response} from 'express';
import * as http from 'http';
import {log} from 'util';
import * as url from 'url';

const kratosClient = new CommonApi(environment.kratos_admin_api);

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/dashboard/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // New hostname+path as specified by question:
  const apiProxy = proxy('/', {
    target: `${environment.kratos_public_api}`,
    pathRewrite: {
      '^/.ory/kratos/public': '',
    },
  });
  server.use('/.ory/kratos', apiProxy);
  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', async (req, res) => {
      const loginConfig = await handleRequest<LoginRequest>(req, res, (r) => kratosClient.getSelfServiceBrowserLoginRequest(r), '/login', 'login');
      if (typeof loginConfig === 'string') {
        console.log(`redirecting /login to ${loginConfig}`);
        return res.redirect(loginConfig);
      }
      const registerConfig =
        await handleRequest<RegistrationRequest>(req, res, (r) =>
          kratosClient.getSelfServiceBrowserRegistrationRequest(r), '/register', 'registration');

      if (typeof registerConfig === 'string') {
        console.log(`redirecting /register to ${registerConfig}`);
        return res.redirect(registerConfig);
      }
      return res.render(indexHtml, {
        req, providers: [{
          provide: APP_BASE_HREF,
          useValue: req.baseUrl
        },
          {
            provide: KRATOS_LOGIN_CONFIGS,
            useValue: loginConfig ? loginConfig.methods.password?.config : null
          },
          {
            provide: KRATOS_REGISTER_CONFIGS,
            useValue: registerConfig ? registerConfig.methods?.password?.config : null
          }
        ]
      });
    }
  );

  return server;
}

function run(): void {
  const port = process.env.PORT || 3000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';

type FetchFunc<T> = (request: string) =>
  Promise<{ response: http.IncomingMessage; body: T; }>;

async function handleRequest<T>(req: Request<any>, response: Response, exec: FetchFunc<T>, path: string, flow: string):
  Promise<T | string | null> {
  if (req.path === path && !req.query.request) {
    return Promise.resolve(`/.ory/kratos/public/self-service/browser/flows/${flow}`);
  }
  if (req.path === path && req.query.request && typeof req.query.request === 'string') {
    return exec(req.query.request)
      .then(resp => {
        return resp.body;
      })
      .catch(err => {
        console.log('error fetching request for req ' + req.query.request);
        console.log(err);
        return Promise.resolve(null);
      });
  } else {
    return Promise.resolve(null);
  }
}
