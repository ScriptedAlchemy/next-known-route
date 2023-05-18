const {
  generateRegexRoutesManifest,
} = require("./generate-regex-routes-manifest");

let routesManifest;
let routesManifestI18n;

beforeEach(() => {
  routesManifest = {
    rewrites: [
      {
        regex:
          "^(?:/(en\\-us|en\\-ca|fr\\-ca))(?:/(help|aider))(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$",
      },
    ],
    staticRoutes: [
      { page: "home", regex: "^/$", routeKeys: {}, namedRegex: "" },
      { page: "about", regex: "^/about$", routeKeys: {}, namedRegex: "" },
    ],
  };

  routesManifestI18n = {
    rewrites: [
      {
        regex:
          "^(?:/(en\\-us|en\\-ca|fr\\-ca))(?:/(help|aider))(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$",
      },
    ],
    staticRoutes: [
      { page: "home", regex: "^/$", routeKeys: {}, namedRegex: "" },
      { page: "about", regex: "^/about$", routeKeys: {}, namedRegex: "" },
    ],
    i18n: {
      locales: ["en-US", "es-MX"],
      defaultLocale: "en-US",
      localeDetection: false,
    },
  };
});

describe("generateRegexRoutesManifest", () => {
  test("returns an array of regex objects", () => {
    const regexRoutes = generateRegexRoutesManifest(routesManifest);
    expect(regexRoutes).toEqual(expect.any(Array));
    regexRoutes.forEach((route) => {
      expect(route).toEqual(
        expect.objectContaining({
          regex: expect.any(String),
        })
      );
    });
  });

  test("generates base routes", () => {
    const regexRoutes = generateRegexRoutesManifest(routesManifest);
    expect(regexRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ regex: "^/$" }),
        expect.objectContaining({ regex: "^/about$" }),
      ])
    );
  });

  test("generates i18n routes", () => {
    const regexRoutes = generateRegexRoutesManifest(routesManifestI18n);
    expect(regexRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ regex: "^(?:(?:\\/(?:en-US|es-MX)))\\/$" }),
        expect.objectContaining({
          regex: "^(?:(?:\\/(?:en-US|es-MX)))\\/about$",
        }),
        expect.objectContaining({ regex: "^/en-US$" }),
        expect.objectContaining({ regex: "^/es-MX$" }),
      ])
    );
  });

  test("generates routes when routes-manifest.json has a rewrites object instead of an array", () => {
    routesManifest.rewrites = {
      beforeFiles: [],
      afterFiles: [
        {
          source:
            "/:nextInternalLocale(en\\-us|en\\-ca|fr\\-ca)/(help|aider)/:wildcard*",
          destination: "/:nextInternalLocale/about/:wildcard*",
          regex:
            "^(?:/(en\\-us|en\\-ca|fr\\-ca))(?:/(mytest|mytest2))(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$",
        },
      ],
      fallback: [],
    };

    const regexRoutes = generateRegexRoutesManifest(routesManifest);

    expect(regexRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({"regex": "^/$"}),
        expect.objectContaining({"regex": "^/about$"}),
        expect.objectContaining({
          regex:
            "^(?:/(en\\-us|en\\-ca|fr\\-ca))(?:/(mytest|mytest2))(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$",
        }),
      ])
    );
  });

  test("should not fail if manifest is not present", () => {
    const isNull = generateRegexRoutesManifest(null);
    const isUndefined = generateRegexRoutesManifest(undefined);
    const isString = generateRegexRoutesManifest("i-am-a-string");

    expect(isNull).toStrictEqual([]);
    expect(isUndefined).toStrictEqual([]);
    expect(isString).toStrictEqual([]);
  });
});
