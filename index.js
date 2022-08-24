const NextRouter = require("next/router");
const { getRouteRegex } = require("next/dist/shared/lib/router/utils/route-regex");
const { getRouteMatcher } = require("next/dist/shared/lib/router/utils/route-matcher");
let knownRoutes = [];
if (typeof window !== "undefined") {
    try {
        knownRoutes = window.__NEXT_DATA__.props.knownRoutes || window.__NEXT_DATA__.props.layoutProps.knownRoutes;
    } catch (e) {

    }
    if (NextRouter.ready) {

        NextRouter.ready(function () {
            try {
                NextRouter.router.pageLoader.getPageList().then(function (pageList) {
                    pageList.forEach(function (page) {
                        if (!knownRoutes.includes(page)) {
                            knownRoutes.push(page);
                        }
                    });
                });
            } catch (e) {
                console.error(e);
            }
        });
    }
}
/**
 *
 * @param additionalRoutes {array} - accepts an array of any additional routes
 * @returns {*[]}
 */
module.exports.getRouteManifest = function getRouteManifest(additionalRoutes = []) {
    if (typeof window !== "undefined") {
        additionalRoutes.forEach(function(page) {
            if (!knownRoutes.includes(page)) {
                knownRoutes.push(page);
            }
        });
    } else if(!process.browser) {
        const path = require("path");
        const fs = require('fs');
        let requireFunc;
        if (typeof __non_webpack_require__ === "undefined") {
            requireFunc = require;
        } else {
            requireFunc = __non_webpack_require__;
        }

        let serverRoutes = [];
        let configuredRoutes = []
        let pageManifest;
        let routeManifest
        if (fs.existsSync(path.join(__dirname, "pages-manifest.json"))) {
            pageManifest = path.join(__dirname, "pages-manifest.json");
        } else if (fs.existsSync(path.join(__dirname, "../pages-manifest.json"))) {
            pageManifest = path.join(__dirname, "../pages-manifest.json");
        } else if (fs.existsSync(path.join(process.cwd(), ".next/server", "pages-manifest.json"))) {
            pageManifest = path.join(process.cwd(), ".next/server", "pages-manifest.json");
        }

        if (fs.existsSync(path.join(__dirname, "route-manifest.json"))) {
          routeManifest = path.join(__dirname, "route-manifest.json");
        } else if (fs.existsSync(path.join(__dirname, "../route-manifest.json"))) {
          routeManifest = path.join(__dirname, "../route-manifest.json");
        } else if (fs.existsSync(path.join(process.cwd(), ".next", "route-manifest.json"))) {
          routeManifest = path.join(process.cwd(), ".next", "route-manifest.json");
        }

        if(pageManifest) {
            try {
                serverRoutes = Object.keys(requireFunc(pageManifest));
            } catch (e) {
                console.error(e);
            }
        }
        if(routeManifest) {
            try {
                var configdRoutes = requireFunc(routeManifest);
                configuredRoutes = [].concat(configdRoutes.dynamicRoutes, configdRoutes.staticRoutes, configdRoutes.rewrites).map(function (route) {
                    return {regex: route.regex}
                })
            } catch(e) {
                console.error(e)
            }
        }
        knownRoutes = Array.from(new Set([].concat(serverRoutes, additionalRoutes, configuredRoutes)));
    }

    return knownRoutes;
};
/**
 * Checks URL against known page routes
 * @param url
 * @returns {boolean}
 */
module.exports.isKnownRoute = function isKnownRoute(url) {
    return knownRoutes.some(function(routeExp) {
        if(typeof routeExp === 'string') {
            var routeRegex = getRouteRegex(routeExp);
            var routeMatcher = getRouteMatcher(routeRegex);
            return routeMatcher(url);
        }

        if(routeExp.regex) {
            return new RegExp(routeExp.regex).test(url)
        }

        return false
    });
};
