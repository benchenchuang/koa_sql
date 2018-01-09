const router = require('koa-router')()

const home = async(ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    });
}

module.exports = {
    home
}