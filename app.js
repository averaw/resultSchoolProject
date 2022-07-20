const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");
const initDatabase = require ("./startUp/initDatabase");
const routes = require('./routes')


const app = express ()
app.use(express.json())
app.use(express.urlencoded({extended:false})) //  просто добавили ,но я пока не поняла зачем 
app.use('/api',routes)

const PORT = config.get ('port') ?? 8080 //для этой строки создана папа config там указан порт 

// if (process.env.NODE_ENV === 'production'){
//     console.log ( 'Production')
// } else {
//     console.log('Development')
// }

async function start() {

    mongoose.connection.once('open',()=>{
initDatabase()
    }) // момент по этой функции за ьсчет нее вносятся все данные в монго

    try {
await mongoose.connect(config.get('mongoUri'))
console.log(chalk.green(`MongoDB connected.`))


          app.listen(PORT,()=>
console.log (chalk.green(`Server has been stated on port ${PORT}`)))
    } catch (error) {
        console.log (chalk.red(error.massage))
        process.exit(1) // типо если ошибка то вообще выходим из си-мы 
    }


  
}

start ()


