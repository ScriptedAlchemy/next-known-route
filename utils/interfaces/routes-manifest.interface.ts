export interface Redirect {
  source: string;
  destination: string;
  locale: boolean;
  internal: boolean;
  statusCode: number;
  regex: string;
}

export interface Route {
  page: string;
  regex: string;
  routeKeys: {
    [key: string]: string;
  };
  namedRegex: string;
}

export interface I18n {
  locales: string[];
  defaultLocale: string;
  localeDetection: boolean;
}

export interface Rsc {
  header: string;
  varyHeader: string;
  contentTypeHeader: string;
}

export interface Rewrite {
  source: string;
  destination: string;
  regex: string;
}

export interface RoutesManifest {
  version: number;
  pages404: boolean;
  basePath: string;
  redirects: Redirect[];
  headers: any[]; // type can be updated once structure is known
  dynamicRoutes: Route[];
  staticRoutes: Route[];
  dataRoutes: any[]; // type can be updated once structure is known
  i18n: I18n;
  rsc: Rsc;
  rewrites: Rewrite[];
}
