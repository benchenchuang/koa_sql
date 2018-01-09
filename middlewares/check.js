module.exports={
    //已经登录
    checkNotLogin:(ctx,next)=>{
        if(ctx.session.user){
            ctx.redirect('/');
            return false;
        }
        next();
    },
    //未登录
    checkLogin:(ctx,next)=>{
        if(!ctx.session.user){
            ctx.redirect('/signin');
            return false;
        }
        next();
    }
}