const { getRouteManifest, isKnownRoute } = require('../');
const nextDirPath = `${process.cwd()}/mocks`;

describe('getRouteManifest', () => {
  beforeAll(() => {
    getRouteManifest([], nextDirPath);
  });

  test('should return an array of known routes', () => {
    const additionalRoutes = [];
    const routes = getRouteManifest(additionalRoutes, nextDirPath);
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(1);
  });

  test('should include additional routes passed in as an argument', () => {
    const additionalRoutes = ['/test-route-1', '/test-route-2'];
    const routes = getRouteManifest(additionalRoutes);
    expect(routes).toContain(additionalRoutes[0]);
    expect(routes).toContain(additionalRoutes[1]);
  });

  test('should filter out duplicate routes', () => {
    const additionalRoutes = ['/test-route-1', '/test-route-1', '/test-route-2'];
    const routes = getRouteManifest(additionalRoutes);
    expect(routes.filter(route => route === additionalRoutes[0]).length).toBe(1);
    expect(routes.filter(route => route === additionalRoutes[1]).length).toBe(1);
  });

  test('should handle invalid input', () => {
    const routes = getRouteManifest(null, '/invalid/path');
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBe(1);
    expect(routes[0]).toBe(null);
  });
});

describe('isKnownRoute', () => {
  beforeAll(() => {
    getRouteManifest([], nextDirPath);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return true for static routes', () => {
    expect(isKnownRoute('/')).toBe(true);
    expect(isKnownRoute('/about')).toBe(true);
    expect(isKnownRoute('/en-ca')).toBe(true);
    expect(isKnownRoute('/en-ca/')).toBe(true)
    expect(isKnownRoute('/en-us')).toBe(true);
    expect(isKnownRoute('/en-us/')).toBe(true);
    expect(isKnownRoute('/fr-ca')).toBe(true);
    expect(isKnownRoute('/fr-ca/')).toBe(true);
    expect(isKnownRoute('/en-ca/about')).toBe(true);
    expect(isKnownRoute('/en-ca/about/')).toBe(true);
  });

  test('should return true for dynamic routes', () => {
    expect(isKnownRoute('/blog/a-slug')).toBe(true);
    expect(isKnownRoute('/en-ca/blog/a-slug')).toBe(true);
    expect(isKnownRoute('/en-us/blog/a-slug')).toBe(true);
    expect(isKnownRoute('/fr-ca/blog/a-slug')).toBe(true);

    expect(isKnownRoute('/blog/a-slug/b-slug')).toBe(true);
    expect(isKnownRoute('/fr-ca/blog/a-slug/b-slug')).toBe(true);
  });

  test('should return false for unknown static routes', () => {
    expect(isKnownRoute('/unknown-route')).toBe(false);
    expect(isKnownRoute('/en-ca/unknown-route')).toBe(false);
    expect(isKnownRoute('/en-ca/unknown-route/about')).toBe(false);
    expect(isKnownRoute('/about/slug')).toBe(false);
    expect(isKnownRoute('/en-ca/about/slug')).toBe(false);
  });

  test('should return false for routes without leading slashes', () => {
    expect(isKnownRoute('unknown-route')).toBe(false);
    expect(isKnownRoute('blog')).toBe(false);
    expect(isKnownRoute('en-ca')).toBe(false);
    expect(isKnownRoute('en-ca/blog')).toBe(false);
  });

  test('should handle invalid input', () => {
    expect(isKnownRoute(null)).toBe(false);
    expect(isKnownRoute(undefined)).toBe(false);
  });
});
