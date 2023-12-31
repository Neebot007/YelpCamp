const User=require('../models/user');
const { storeReturnTo } = require('../middleware');
const passport = require('passport');
module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
}
module.exports.register=async(req,res,next)=>{
    try{
    const {email,username,password}=req.body;
    const user=new User({email,username});
    const RegisteredUser=await User.register(user,password);
    req.login(RegisteredUser,err=>{
        if(err) return next(err);
        req.flash('success','Welcome to YelpCamp!!');
        res.redirect('/campgrounds');
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}
module.exports.renderLogin=(req,res)=>{
    res.render('users/login');
}
module.exports.logout=(req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Goodbye');
        res.redirect('/campgrounds');
    });
}