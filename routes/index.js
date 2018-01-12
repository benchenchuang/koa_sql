const router = require('koa-router')()
const HomeModel=require('../lib/mysql');
const moment=require('moment');
const home = async(ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!',
        user:ctx.session.user,
        index:1
    });
};

const banners=async (ctx,next)=>{
    await ctx.render('banners', {
        title: '轮播图列表',
        user:ctx.session.user,
        index:2
    });
};
const getBanners=async (ctx,next)=>{
    var banners=await HomeModel.getBanners();
    var allTotal=banners.length;
    var limit = parseInt(ctx.query.limit) || 2;
    var page=parseInt(ctx.query.page) || 1;
    var allPages=Math.ceil(allTotal/limit);
    var getPageBanner=await HomeModel.getPageBanners(page,limit);
    if(banners){
        return ctx.body={
            status:2,
            data:getPageBanner,
            maxPage:allPages,
            minPage:1,
            thisPage:page
        }
    }else{
        return ctx.body={
            status:1,
            data:'获取失败'
        }
    }
    
}

const deleteBanner=async (ctx,next)=>{
    const id=ctx.request.body.id;
    await HomeModel.deleteBanner(id).then(async res=>{
        if(res.serverStatus==2){
            return ctx.body={
                status:2,
                data:'删除成功'
            }
        }
    })
}

const postCreateBanner=async (ctx,next)=>{
    var formData=ctx.request.body;
    var id=formData.id;
    var name=formData.name;
    var content=formData.content;
    var url=formData.url;
    var online=formData.online;
    var pic=formData.pic;
    try{
        if(!name){
            throw new Error('名称不能为空')
        }
        if(!content){
            throw new Error('内容不能为空')
        }
        if(!pic){
            throw new Error('图片不能为空')
        }
    }catch(e){
        return ctx.body={
            status:0,
            data:e.message
        }
    }
    console.log(id)

    if(!id){
        await HomeModel.createBanner([name,content,url,pic,online,moment().format('YYYY-MM-DD HH:mm:ss')]).then(async res=>{
            if(res){
             return ctx.body={
                 status:2,
                 data:'上传成功'
               }
            }else{
             return ctx.body={
                 status:1,
                 data:'上传失败'
               }
            }
        });
    }else{
        await HomeModel.updateBanner(id,name,content,url,pic,online,moment().format('YYYY-MM-DD HH:mm:ss')).then(async res=>{
            if(res){
                return ctx.body={
                    status:2,
                    data:'更新成功'
                }
            }else{
                return ctx.body={
                    status:1,
                    data:'更新失败'
                }
            } 
        })
    }
}

const getBanner=async (ctx,next)=>{
    var id=ctx.query.id;
    await HomeModel.bannerById(id).then(async res=>{
        return ctx.body={
            status:2,
            data:res
        }
    })
}
module.exports = {
    home,
    banners,
    postCreateBanner,
    getBanners,
    deleteBanner,
    getBanner
}