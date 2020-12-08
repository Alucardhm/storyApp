const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')


//Load config
dotenv.config({path: './config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(methodOverride('_method'))
// logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helpers
const helperFile = require('./helpers/hbs')

const helpers = {
   formatDate: helperFile.formatDate,
   truncate: helperFile.truncate,
   editIcon: helperFile.editIcon,
   select: helperFile.select
}
// handlebars

app.engine('.hbs',exphbs({helpers,defaultLayout: 'main',extname: '.hbs'}))
app.set('view engine','.hbs')

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// passport middleware
app.use(passport.initialize()) // inicia o modulo de autenticação
app.use(passport.session()) 


// Set Global Variable
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})

// Static folder
app.use(express.static(path.join(__dirname,'public')))


// Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

// 404 Route
app.get('*', (req, res) => {
    res.status(404).render('error/404');
})
app.listen(process.env.PORT || 3000)