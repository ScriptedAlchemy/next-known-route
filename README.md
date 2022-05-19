# next-known-route
Check if a url is a known route to a next.js application ahead of time.

https://www.npmjs.com/package/next-known-route

# Use Case
Why do you need this? Next does not offer a way to know if a url matches a known route with the application.
The only way to do it out the box is to try and preload the route, which is wasteful & only works on the client. 

- Understanding internal vs external links during render or elsewhere in your application (like utils)
- SEO - no follow links to external sources.
- Any feature that requires a page manifest lookup.
- Dynamic navigation and route expressions matching.

No third party dependencies, this is all made possible by using internal parts of next router.

# Usage:

In `_app` add the following and return it from `getInitialProps`

```js
import { getRouteManifest, isKnownRoute } from 'next-known-route'

const MyApp = ()=>{
    const internalRoute = isKnownRoute('/') // or whatever path you want to check aganst. Returns true|false
    return (<main/>)
}

MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);

    const props = {
        ...appProps,
        knownRoutes: getRouteManifest()  // returns ['/_app','/','/[...slug]']
    };
    return props
}
```

## Features
- Works on server and client
- No external libraries needed, only 50 LOC
- `getRouteManifest` accepts an array of additional path expressions to match against. 

Contributions are welcome. 