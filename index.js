import NextRouter from "next/router";
import {getRouteRegex, getRouteMatcher} from 'next/dist/shared/lib/router/utils'

let knownRoutes = [];
if(typeof window !== "undefined") {
    try {
        knownRoutes = window.__NEXT_DATA__.props.knownRoutes || window.__NEXT_DATA__.props.layoutProps.knownRoutes;
    } catch(e) {

    }
    NextRouter.ready(function() {
        try {
            NextRouter.router.pageLoader.getPageList().then(function (pageList) {
                pageList.forEach(function (page) {
                    if (!knownRoutes.includes(page)) {
                        knownRoutes.push(page);
                    }
                })
            })
        } catch (e) {
            console.error(e)
        }
    });
}
/**
 *
 * @param additionalRoutes {array} - accepts an array of any additional routes
 * @returns {*[]}
 */
export const getRouteManifest = function getRouteManifest(additionalRoutes = []) {
    if(typeof window !== "undefined") {
        additionalRoutes.forEach(function (page) {
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
        knownRoutes = Array.from(new Set([].concat(serverRoutes, additionalRoutes)));
    }

    return knownRoutes
}
/**
 * Checks URL against known page routes
 * @param url
 * @returns {boolean}
 */
export const isKnownRoute = function isKnownRoute(url) {
    return knownRoutes.some(function (routeExp) {
        var routeRegex = getRouteRegex(routeExp);
        var routeMatcher = getRouteMatcher(routeRegex);
        return routeMatcher(url);
    });
};