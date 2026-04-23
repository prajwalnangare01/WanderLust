require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const mongo_uri = process.env.ATLASDB_URL || 'mongodb://localhost:27017/wanderlust'
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')
const userRouter = require('./routes/user.js');
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.engine('ejs', ejsMate);
app.use(methodoverride('_method'));

const secret = process.env.SECRET || 'mysuperserioussecret';

const store = MongoStore.default.create({
    mongoUrl: mongo_uri,
    secret: secret,
    touchAfter: 24 * 60 * 60,
})

store.on('error', () => {
    console.log("Error in Mongo Session Store");
})


app.use(session({
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true // To prevent cross-scripting attacks
    }
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use('/listings', listingsRouter);
app.use('/listings/:id/review', reviewsRouter);
app.use('/', userRouter);

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_uri);
}

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.get('/demouser', async (req, res) => {
    let fakeUser = new User({
        email: "Sam@gmail.com",
        username: "Sam"
    })
       
    let registeredUser = await User.register(fakeUser, "password" );
    res.send(registeredUser);
})




app.use( (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) =>{
    let {statusCode = 500, message= "Something went wrong"} = err; // Destructure statusCode
    res.status(statusCode).render('error.ejs', {err}); // Use statusCode
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
