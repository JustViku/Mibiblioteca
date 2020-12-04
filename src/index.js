const express = require('express');
const morgan = require('morgan');
const exhbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const passport = require('passport');
const mimeTypes = require('mime-types');
const multer = require('multer');

const {database} = require('./keys');

//inicializaciones
const app = express();

require('./libs/passport');


//configuraciones
app.set('port', process.env.PORT || 4000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
   defaultLayout: 'main', 
   layoutsDir: path.join(app.get('views'), 'layouts'),
   partialsDir: path.join(app.get('views'), 'partials'),
   extname: '.hbs',
   helpers: require('./libs/handlebars')
}));
app.set('view engine', '.hbs');

//MiddleWares 
app.use(session({
    secret: 'MiBiblioteca',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database)

}));



app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());






//Variables globales
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentification'));
app.use('/libros',require('./routes/libros'));


//Public
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
