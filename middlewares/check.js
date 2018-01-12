module.exports={
    //已经登录
    checkNotLogin:async (ctx,next)=>{
        try{
            if(ctx.session.user){
                return ctx.redirect('/admin')
            }
        }catch(e){
            return ctx.redirect('/admin/login')
        }
        await next();
    },
    //未登录
    checkLogin:async (ctx,next)=>{
        if(!ctx.session.token){
            return ctx.redirect('/admin/login')
        }
        await next();
    }
}