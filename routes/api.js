const router = require('koa-router')();
const HomeRouter = require('./index');
const Users = require('./users');
// 首页
router.get('/', HomeRouter.home);

//用户
router.get('/users', Users.users)

//地址错误
router.get('/*', async(ctx, next) => {
    await ctx.render('404', {
        title: '404 page'
    });
})
module.exports = router;