if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const PGError = require('./util/PGError');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const passport = require('passport');
const passportLocal = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL;
const  secret = process.env.SECRET;

const parkRoutes = require('./routes/parks');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
    console.log('Session error', e);
})

const sessionConfigs = {
    store,
    name: 'cchip',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 604800000,
        maxAge: 604800000,
        // secure: true,
        httpOnly: true
    }
}
app.use(session(sessionConfigs));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize({ replaceWith: '_', }),);
app.use(helmet({ contentSecurityPolicy: false }));

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
// 'mongodb://localhost:27017/park-guide'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    /*useCreateIndex: true,*/
    useUnifiedTopology: true,
    /*useFindAndModify: false*/
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected');
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/parks', parkRoutes);
app.use('/parks/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home');
})
app.all('*', (req, res, next) => {
    next(new PGError('Page not found!', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no! Something went wrong!!';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 1808;
app.listen(port, () => {
    console.log('Listening on port 1808');
})