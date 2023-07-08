const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users=require('../controllers/user');
const user = require('../models/user');
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','WelcomeBack!');
    const redirectUrl=res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

});
router.get('/logout',users.logout);
module.exports=router;