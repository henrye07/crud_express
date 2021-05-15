// ------------------LIBRARIES------------------------
const express = require('express')
const app= express()
const exphbs = require('express-handlebars')
const session = require("express-session")
const flash = require('express-flash');
const passport = require('passport');
const fileUpload = require('express-fileupload')


require('./passport');
// ------------------CONSTANT------------------------
const port= process.env.PORT || 3000;
// ------------------EXPRESS-FILEUPLOAD------------------------

app.use(fileUpload())

// ------------------EXPRESS-FLASH------------------------

app.use(flash())

// ------------------EXPRESS-SESSION------------------------

app.use(session({
    secret:'Secreto',
    resave:false,
    saveUninitialized:true,
}))

// ------------------EXPRESS-HANDLEBARS------------------------
    //  INICIALIZAR PASSPORT
app.use(passport.initialize())
app.use(passport.session()) //QUE UTILICE LAS SESIONES
// ----------------------------------------------------------
app.use( express.urlencoded({ extended:false })) 

app.engine('.hbs', exphbs())
app.set('view engine', '.hbs')

app.use(require('./routes/index'))
app.use(require('./routes/auth'))
app.use(require('./routes/uploads'))

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

// ------------------MYSQL DESCONNECT------------------------
// connection.end()


