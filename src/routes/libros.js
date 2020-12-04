const express = require('express');
const router = express.Router();
const multer = require('multer');




const pool = require('../database');
const { isLoggedIn } = require('../libs/auth')

//archivos
const storage = multer.diskStorage({
    destination:'src/public/uploads',
    filename: function(req,file,cb){
        const archivo = cb("",file.originalname);
    }
});

const upload = multer({
    storage: storage
});


router.get('/fav',isLoggedIn,upload.single('imagen'), (req,res) => {
    res.render('libros/fav');
});




//mas de un archivo
const dobleInput = upload.fields([{name: 'image'},{name: 'archivo'}]);


router.post('/fav',isLoggedIn, dobleInput, async (req,res) => {
    const archivo = req.files.archivo[0].originalname;
    const image = req.files.image[0].originalname;
    const{ title, file, } = req.body;
    const newLibro = {
        title,
        archivo,
        image,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO libros set ?', [newLibro]);
    req.flash('success', 'Libro subido correctamente');
    res.redirect('/libros');
});


router.get('/',isLoggedIn, async(req,res) => {
    const libros = await pool.query('SELECT * FROM libros WHERE fav = 0 AND user_id = ?',[req.user.id]);
    res.render('libros/list', {libros});
    
});

//

//favoritos



router.post('/favoritos',isLoggedIn, dobleInput, async (req,res) => {
    console.log(req.body)
    const fav = 1;
    const{ title, file,archivo,image, } = req.body;
    const newLibro = {
        title,
        archivo,
        image,
        user_id: req.user.id,
        fav
    };
    await pool.query('INSERT INTO libros set ?', [newLibro]);
    req.flash('success', 'Libro añadido a favoritos');
    res.redirect('/profile');
});


router.get('/delete/:id', isLoggedIn, async(req,res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM libros WHERE id = ?', [id]);
    req.flash('success', 'Libro borrado correctamente');
    res.redirect('/profile');
   
});










module.exports = router;



