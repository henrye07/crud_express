// ------------------LIBRARIES------------------------
const express = require('express')
const app= express()
const exphbs = require('express-handlebars')
const passport=require("passport")
const localStrategy=require("passport-local").Strategy
const bcrypt=require("bcrypt")
const connection = require('./database');
const session = require("express-session")


// ------------------CONSTANT------------------------
const port= process.env.PORT || 3000;

// ------------------PASSPORT------------------------

passport.use('local.signup',new localStrategy({
    usernameField:'email',
    passwordField:'password'
}, async (username, password, done)=>{
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)
    const user = { email:username, password:hash }
    const result = await connection.query('INSERT INTO users SET ?', user)
    user.id=result.insertId
    console.log(username, password,hash,result)
    done(null,user)
}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
    const rows = await connection.query(`SELECT * FROM users WHERE id=${id}` )
    done(null,rows[0])
})

// ------------------EXPRESS-SESSION------------------------

app.use(session({
    secret:'Secreto',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:true}
}))


// ------------------EXPRESS-HANDLEBARS------------------------
    //  INICIALIZAR PASSPORT
app.use(passport.initialize())
app.use(passport.session()) //QUE UTILICE LAS SESIONES
// ----------------------------------------------------------
app.use( express.urlencoded({ extended:false }))

app.engine('.hbs', exphbs())
app.set('view engine', '.hbs')

app.use(require('./routes/auth'))
app.use(require('./routes/index'))

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

// ------------------MYSQL DESCONNECT------------------------
// connection.end()


