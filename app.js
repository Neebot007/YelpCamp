if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
const express=require('express');
const app=express();
const path=require("path");
const flash=require("connect-flash");
const ExpressError=require("./utils/ExpressError.js");
const ejsMate=require('ejs-mate');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const userRoutes=require('./routes/users.js');
const campgroundsRoutes=require('./routes/campground.js');
const reviewsRoutes=require('./routes/reviews.js');
const passport=require('passport');
const LocalStratergy=require('passport-local');
const mongoSanitize=require('express-mongo-sanitize');
const User=require('./models/user.js');
//const dbUrl=process.env.DB_URL;
const dbUrl='mongodb://127.0.0.1:27017/yelp-camp';
const methodOverride=require("method-override");
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
const mongoose=require("mongoose");
const campground = require('./models/campground.js');
const { stat } = require('fs');
const user = require('./models/user.js');
mongoose.connect(dbUrl,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("connection success");
})
.catch((err)=>{
    console.log("error ocuurd");
    console.log(err);
})
app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// app.get("/makecampground",async(req,res)=>{
//     const camp=new Campground({title:'My back yard',description:'cheap camping'});
//     res.send(camp);
// })
app.listen(3000,()=>{
    console.log("Serving on port 3000");
})
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret'
    }
});
store.on('error',function(e){
    console.log("SESSION STORE ERROR",e);
})
const sessionConfig = {
    store,
    name:'session',
    secret:'thisshouldbeabettersecret',
    resave:true,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(mongoSanitize());
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use("/",userRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/reviews",reviewsRoutes);
app.use(express.static(path.join(__dirname,'public')))

app.get("/",(req,res)=>{
    res.render("home");
})

app.all('*',(req,res,next)=>{
    next(new ExpressError("page not found",404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Something went wrong';
    res.status(statusCode).render('error.ejs',{err});
})
