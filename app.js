const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const session=require('koa-session');
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const config = require('./config/default')
const api = require('./routes/api')
const cors=require('koa2-cors')

app.keys=['me session'];
const setConfig={
  key:'token',
  maxAge:183000000,
  overwrite: true, 
  httpOnly: true,
  signed: true, 
  rolling: false,
}

app.use(session(setConfig,app));

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(cors());
// routes
app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error2', err, ctx)
});

module.exports = app