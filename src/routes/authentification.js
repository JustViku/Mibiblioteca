const express = require('express');
const router = express.Router();
const pool = require('../database');

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../libs/auth')

router.get('/signup',isNotLoggedIn, (req,res) =>{
    res.render('auth/signup');

});

router.post('/signup',isNotLoggedIn, passport.authenticate('local.signup', {
        successRedirect:'/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

router.get('/signin',isNotLoggedIn,  (req,res) =>{
    res.render('auth/signin');

});

router.post('/signin',isNotLoggedIn, (req,res,next) =>{
    passport.authenticate('local.signin',{
        successRedirect:'/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res,next)

});

router.get('/profile',isLoggedIn,async (req,res) =>{
    const favoritos = await pool.query('SELECT * FROM libros WHERE fav = 1 AND user_id = ?',[req.user.id]);
    const libros = await pool.query('SELECT * FROM libros WHERE fav = 0 AND user_id = ?',[req.user.id]);

    res.render('profile',{libros,favoritos})
});

router.get('/logout', (req,res) =>{
    req.logOut();
    res.redirect('/signin');
});

router.get('/texto',  async(req,res) =>{
    const texto = await pool.query('SELECT * FROM libros WHERE categoria = ?', 'texto');

    res.render('nav/texto',{texto});

});

router.get('/educa',  async(req,res) =>{
    const educa = await pool.query('SELECT * FROM libros WHERE categoria = ?', 'educativos');

    res.render('nav/educa',{educa});

});

router.get('/comic',  async(req,res) =>{
    const comic = await pool.query('SELECT * FROM libros WHERE categoria = ?', 'comic');

    res.render('nav/comic',{comic});

});

router.get('/manga',  async(req,res) =>{
    const manga = await pool.query('SELECT * FROM libros WHERE categoria = ?', 'manga');
    res.render('nav/manga',{manga});

});

router.get('/librosusuarios',  async(req,res) =>{
    const librosusuarios = await pool.query('SELECT * FROM libros WHERE user_id IS NOT NULL');
    res.render('nav/librosusuarios',{librosusuarios});

});

module.exports = router;
