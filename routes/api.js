const router = require('koa-router')();
const checkNotLogin=require('../middlewares/check').checkNotLogin;
const checkLogin=require('../middlewares/check').checkLogin;
const HomeRouter = require('./index');
const Sign = require('./sign');
// 上传图片的中间件
const multer=require('koa-multer');
//配置  
var storage = multer.diskStorage({  
  //文件保存路径  
  destination: function (req, file, cb) {  
    cb(null, 'public/uploads/')  
  },  
  //修改文件名称  
  filename: function (req, file, cb) {  
    var fileFormat = (file.originalname).split(".");  
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);  
  }  
}) 
//加载配置  
var upload = multer({ storage: storage }); 

// 首页
router.get('/admin/', HomeRouter.home);
//轮播列表
router.get('/admin/banners',HomeRouter.banners);
router.get('/admin/banners/list',HomeRouter.getBanners)
//新建轮播内容
router.post('/admin/banner/create',HomeRouter.postCreateBanner);
//获取轮播内容
router.get('/admin/banner/content',HomeRouter.getBanner);
//删除轮播
router.post('/admin/banner/remove',HomeRouter.deleteBanner);
//上传banner图片
router.post('/admin/upload/banner',upload.single('banner'),Sign.postAvatar);
//用户注册
router.get('/admin/signup', checkNotLogin, Sign.getSignup);
router.post('/admin/signup',Sign.postSignup);
//验证码
router.get('/admin/code',Sign.code);
//用户登录
router.get('/admin/login',checkNotLogin, Sign.getLogin);
router.post('/admin/login',Sign.postLogin);
//用户退出
router.get('/admin/getOut',Sign.getOut);
//用户信息设置
router.get('/admin/setting',Sign.getSet);
router.post('/admin/setting',Sign.postSet);
//上传头像
router.post('/admin/avatar',upload.single('avatar'),Sign.postAvatar);


//地址错误
router.get('/*', async(ctx, next) => {
    await ctx.render('404', {
        title: '404 page'
    });
})
module.exports = router;