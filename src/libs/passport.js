
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database')
const helpers = require('../libs/helpers')




passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    console.log(req.body)
     const rows = await pool.query('SELECT * FROM users WHERE username = ?',[username])
     if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.compararPassword(password,user.password);
        if(validPassword){
            console.log(validPassword)
            done(null, user, req.flash('success','Bienvenido '+ user.username));
            console.log('iniciado');
        }
        else{
            done(null, false, req.flash('message','Contraseña incorrecta'));
            console.log('contraseña incorrecta')

        }
     }else{ 
         console.log('usuario no existe')
         return done(null, false, req.flash('message','El usuario no existe'));
        

     }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    
     const rows = await pool.query('SELECT * FROM users')
     console.log(rows.length);
     let aux = true;
     
     for (let i = 0; i < rows.length; i++) {
         
         if(rows.length > 0){
            console.log("entro rows")
            console.log(rows)
            const user = rows[i];
            console.log(username);
            console.log(user.username);

        if(username == user.username){
            aux = false;
            console.log(aux)
            
        }
     }
       
     }
     if(aux == true){
        console.log("entro 2");
        const{ correo }= req.body;
        const newUser = {
            username,
            password,
            correo
        };
        newUser.password = await helpers.encryptPassword(password);

        const result = await pool.query('INSERT INTO users SET ?',[newUser]);
        newUser.id = result.insertId;
        done(null,newUser);
     }else{
        done(null, false, req.flash('message','Nombre de Usuario ya existente'));
        console.log('Usuario repetido')
     }
     
}));



    passport.serializeUser((user, done) =>{
        done(null,user.id);
    });

    passport.deserializeUser (async (id, done) => {
        const rows = await pool.query('SELECT * FROM users Where id = ?', [id]);
        done(null, rows[0])

    });