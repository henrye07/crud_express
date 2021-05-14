const util = require('util')

const mysql = require('mysql')

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prueba'
}

const connection= mysql.createConnection(config)

// ------------------MYSQL CONNECT------------------------

connection.connect(error =>{
    if (error) throw error
    
    console.log(connection.threadId)
})

connection.query=util.promisify(connection.query)

module.exports=connection

