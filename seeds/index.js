const campground = require("../models/campground.js");
const Campground=require("../models/campground.js");
const cities=require("./cities.js")
const {descriptors,places}=require("./seedHelper.js");
const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{ 
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
const sample=(arr)=>arr[Math.floor(Math.random()*arr.length)];
const seedDB=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        let rand=Math.floor(Math.random()*1000);
        let price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:"64997a76fad6d9906d1701de",
            location:`${cities[rand].city},${cities[rand].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            images:[
                    {
                      url: 'https://res.cloudinary.com/dpkd9ccta/image/upload/v1687857780/yelp-camp/c3i4teqvh6nya4smd22b.jpg',
                      filename: 'yelp-camp/c3i4teqvh6nya4smd22b',
                    },
                    {
                      url: 'https://res.cloudinary.com/dpkd9ccta/image/upload/v1687857780/yelp-camp/i2yrixlz8w1flbiyotdj.jpg',
                      filename: 'yelp-camp/i2yrixlz8w1flbiyotdj',
                    }
            ],
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, ducimus? Aliquid fuga eius suscipit. Aliquam, sit id adipisci, quo praesentium accusantium nobis optio soluta velit assumenda, provident in omnis iusto!',
            price:price
        })
        await camp.save();

    }
}
seedDB().then(()=>{
    mongoose.connection.close();
});
