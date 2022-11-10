const proxy = require('koa-better-http-proxy')

const PROXY_BASE_PATH = '/graphql'

module.exports = function shopifyProxy(proxyOptions) {
  return async function shopifyProxyMiddleware(ctx, next) {
    if (ctx.path !== PROXY_BASE_PATH || ctx.method !== 'POST') {
      await next()
      return
    }
    // console.log('ctx.headers', ctx.headers)
    await proxy(process.env.SHOP_URL, {
      https: true,
      parseReqBody: false,
      headers: {
        'Content-Type': 'application/graphql',
        'X-Shopify-Storefront-Access-Token':
          process.env.STOREFRONT_ACCESS_TOKEN,
      },
      proxyReqOptDecorator(proxyReqOpts) {
        // Don't remove this line, look like the proxy auto add `content-type: application/json` so we need to delete it because shopify use `application/graphql`
        delete proxyReqOpts.headers['content-type']
        return proxyReqOpts
      },
      proxyReqPathResolver() {
        return `/api/${proxyOptions.version}/graphql.json`
      },
    })(ctx, noop)
  }
}

async function noop() {}
