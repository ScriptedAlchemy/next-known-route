/**
 *
 * @typedef {import("./interfaces/routes-manifest.interface").RoutesManifest} RoutesManifest
 */

/**
 * Checks URL against known page routes
 * @param {RoutesManifest} routesManifest
 */
const generateRegexRoutesManifest = (routesManifest) => {
  const baseRoutesRegex = generateBaseRoutes(routesManifest);
  const i18nRoutesRegex = generateI18nRoutes(routesManifest);

  return [...baseRoutesRegex, ...i18nRoutesRegex];
};

/**
 *
 * @param {RoutesManifest} routesManifest
 */
const generateBaseRoutes = (routesManifest) => {
  const configuredRoutes = [
    ...routesManifest.dynamicRoutes,
    ...routesManifest.staticRoutes,
    ...routesManifest.rewrites,
  ];

  return configuredRoutes.map(function (route) {
    return { regex: route.regex };
  });
};

/**
 * @param {string} regexString
 * @param {Array<string>} locales
 * @returns {string}
 */
const buildI18nRegex = (regexString, locales) => {
  // Remove the leading caret from the regexString
  const baseRouteRegex = RegExp(RegExp(regexString).source.replace(/^\^/, ""));

  // Build a regex that matches any of the supported locales
  const leadingI18nPathsRegex = RegExp(
    /(?:\/(?:pipeDelimitedLocales))/.source.replace(
      "pipeDelimitedLocales",
      locales.join("|")
    )
  );

  // Build a regex that matches any of the supported locales followed by the base route regex
  const i18nRegex = RegExp(
    `^(?:${leadingI18nPathsRegex.source})${baseRouteRegex.source}`
  );

  return i18nRegex.source;
};

/**
 *
 * @param {RoutesManifest} routesManifest
 */
const generateI18nRoutes = (routesManifest) => {
  if (routesManifest?.i18n?.locales?.length > 0) {
    const configuredRoutes = [
      ...routesManifest.dynamicRoutes,
      ...routesManifest.staticRoutes,
    ];
    const locales = routesManifest.i18n.locales;

    return (
      configuredRoutes
        .map((route) => {
          return { regex: buildI18nRegex(route.regex, locales) };
        }).concat(locales.map((locale) => {
          return { regex: `^\/${locale}$` };
        }))
    );
  }
  return [];
};

module.exports = { generateRegexRoutesManifest };
