require('dotenv').config()

const Koa = require('koa')
const cors = require('@koa/cors')
const shopifyProxy = require('./shopify-proxy')

const app = new Koa()

app.use(cors())
app.use(shopifyProxy({ version: '2022-10' }))

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on ${process.env.PORT || 3000} port`)
})
