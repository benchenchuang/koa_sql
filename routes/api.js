const router=require('koa-router')();
const HomeRouter=require('./index');
const Users=require('./users');
// 首页
router.get('/',HomeRouter.home);

//用户
router.get('/users',Users.users)

module.exports=router;
