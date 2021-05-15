const passport=require("passport")
const localStrategy=require("passport-local").Strategy
const bcrypt=require("bcrypt")
const connection = require('./database');


// ------------------PASSPORT------------------------
            //  SIGNIN
            passport.use('local.signin',new localStrategy({
                usernameField:'email',
                passwordField:'password'
            }, async (username, password, done)=>{
                const rows= await connection.query(`SELECT * FROM users WHERE email= '${username}'`)
                if (rows.length > 0) {
                    const user= rows[0]
                    const validPass= await bcrypt.compare(password,user.password)
                    if (validPass) {
                        return done(null,user)
                    } else {
                        return done(null,false,{ message:'La credenciales no coinciden con nuestro registros'})
                    }
                } else{
                    return done(null, false, { message: 'La credenciales no coinciden con nuestro registros' })
                }
            }))
            
                          //  SIGNUP
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
                const rows = await connection.query(`SELECT id, email FROM users WHERE id=${id}` )
                done(null,rows[0])
            })
            