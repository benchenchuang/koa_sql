const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const session = require('koa-generic-session')
const MysqlStore = require('koa-mysql-session')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const config = require('./config/default')

const api = require('./routes/api')

//session存储配置
const sessionConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST
}
const THIRTY_MINTUES = 30 * 60 * 1000;
app.keys = ['your-session-secret']
app.use(session({
    store: new MysqlStore(sessionConfig),
    rolling: true,
    cookie: {
        maxage: THIRTY_MINTUES
    }
}))

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

// routes
app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error2', err, ctx)
});

module.exports = app