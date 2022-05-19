const NextRouter = require("next/router");
const {getRouteRegex, getRouteMatcher} = require('next/dist/shared/lib/router/utils')

let knownRoutes = [];
if (typeof window !== "undefined") {
    knownRoutes = window.__NEXT_DATA__.props.knownRoutes || window.__NEXT_DATA__.props.layoutProps.knownRoutes;
    NextRouter.ready(() => {
        NextRouter.router.pageLoader.getPageList().then((pageList) => {
            pageList.forEach(page => {
                if (!knownRoutes.includes(page)) {
                    knownRoutes.push(page);
                }
            })
        })
    });
}
/**
 *
 * @param additionalRoutes {array} - accepts an array of any additional routes
 * @returns {*[]}
 */
const getRouteManifest = (additionalRoutes = []) => {
    if (typeof window !== "undefined") {
        additionalRoutes.forEach(page => {
            if (!knownRoutes.includes(page)) {
                knownRoutes.push(page);
            }
        });
    } else {
        const path = require('path')
        let serverRoutes
        try {
            serverRoutes = Object.keys(__non_webpack_require__(path.join(__dirname, 'pages-manifest.json')))
        } catch (e) {
            serverRoutes = Object.keys(__non_webpack_require__(path.join(__dirname, '../pages-manifest.json')))
        }

        knownRoutes = Array.from(new Set([serverRoutes].concat(additionalRoutes)))
    }

    return knownRoutes
}
/**
 * Checks URL against known page routes
 * @param url
 * @returns {boolean}
 */
const isKnownRoute = (url) => {
    return knownRoutes.some((routeExp) => {
        const routeRegex = getRouteRegex(routeExp);
        const routeMatcher = getRouteMatcher(routeRegex);
        return routeMatcher(url)
    });
}

module.exports.getRouteManifest = getRouteManifest
module.exports.isKnownRoute = isKnownRoute
