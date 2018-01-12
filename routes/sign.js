const userModel=require('../lib/mysql');
const md5=require('md5');
const moment=require('moment');
const fs=require('fs');
const captchapng=require('captchapng');

//生成数字验证码
const code=async (ctx,next)=>{
  var str=parseInt(Math.random()*9000+1000);
  ctx.session.code=str;
  var p = new captchapng(80, 30, str); //生成图片
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);
  var img = p.getBase64();
  var imgbase64 = new Buffer(img, 'base64');
  ctx.response.type="image/png";
  ctx.body=imgbase64;
};

const getSignup=async (ctx,next)=>{
  await ctx.render('sign',{
    title:'注册'
  })
}

const postSignup=async (ctx,next)=>{
  var formData=ctx.request.body;
  var username=formData.username;
  var password=formData.password;
  var repassword=formData.repassword;

  //判断用户填写信息
  try{
    if(!username){
      throw new Error('用户名不能为空')
    }
    if(password.length<1){
      throw new Error('密码不能为空')
    }
    if(password!=repassword){
      throw new Error('两次密码不一致')
    }
  }catch(e){
    return ctx.body={
      status:0,
      data:e.message
    }
  }

  password=md5(password);

  await userModel.findByName(username).then(async res=>{
    if(res.length){
      try{
        throw new Error('用户名已存在')
      }catch(e){
        return ctx.body={
          status:1,
          data:e.message
        }
      }
    }else{
      await userModel.registerData([username,password,moment().format('YYYY-MM-DD HH:mm:ss')]).then(res=>{
        if(res.protocol41){
          return ctx.body={
            status:2,
            data:'注册成功'
          }
        }else{
          return ctx.body={
            status:3,
            data:'注册失败'
          }
        }
      })
    }
  })

}

const getLogin=async(ctx,next)=>{
  await ctx.render('login',{
    title:'登录'
  })
}

const postLogin=async (ctx,next)=>{
    var formData=ctx.request.body;
    var username=formData.username;
    var password=formData.password;
    var code=formData.code;
    var sessionCode=ctx.session.code;
    try{
      if(code!=sessionCode){
        throw new Error("验证码不正确")
      }
    }catch(e){
      return ctx.body={
        status:0,
        data:e.message
      }
    }
    await userModel.findByName(username).then(async res=>{
      if(res.length){
        var userInfo=res[0];
        if(userInfo.password!=md5(password)){
          return ctx.body={
            status:1,
            data:'密码不正确'
          }
        }else{
          userInfo.password='';
          ctx.session.user=userInfo;
          return ctx.body={
            status:2,
            data:'登录成功'
          }
        }
      }else{
        return ctx.body={
          status:3,
          data:'用户不存在'
        }
      }
    })
}

const getOut=async (ctx,next)=>{
    ctx.session.user="";
    await ctx.redirect('/admin');
}
const postAvatar=async (ctx,next)=>{
  const filename=ctx.req.file.filename;
  return ctx.body={
    status:2,
    data:{
      avatar:filename,
      text:'上传成功'
    }
  }
}
const getSet=async (ctx,next)=>{
    await ctx.render('setting',{
      title:'设置信息',
      user:ctx.session.user
    })
}
const postSet=async (ctx,next)=>{
  const formData=ctx.request.body;
  var userid=formData.userid;
  var password=formData.password;
  var repassword=formData.repassword;
  var avatar=formData.avatar;
  
  try{
    if(password!=repassword){
      throw new Error('两次密码不一致');
    }
  }catch(e){
    return ctx.body={
      status:0,
      data:e.message
    }
  }

  if(password.length>0){
    password=md5(password)
    await userModel.updateUser([password,formData.avatar,userid]).then(async res=>{
      if(res){
        ctx.session.user='';
        return ctx.body={
          status:1,
          data:'修改成功'
        }
      };
    });
  }else{
    await userModel.updateAvatar([formData.avatar,userid]).then(async res=>{
      if(res){
        ctx.session.user.avator=formData.avatar;
        return ctx.body={
          status:2,
          data:'修改成功'
        }
      };
    });
  }

}

module.exports = {
  code,
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  getOut,
  getSet,
  postAvatar,
  postSet
}
