require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const jwt = require('jsonwebtoken');
const app = express();
require('./db/conn')
const bcrypt = require("bcryptjs");
const Register = require('../src/models/login')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../public')))
const templatedata = path.join(__dirname, '../templates/views')
const partialdata = path.join(__dirname, '../templates/partials')

hbs.registerPartials(partialdata)
app.set("views", templatedata)
app.set('view engine', 'hbs')


console.log(process.env.SECRET_KEY)

app.get('/', (req, res) => {
    res.render('index')

})
app.get('/registration', (req, res) => {
    res.render('registration')

})
app.get('/login', (req, res) => {
    res.render('login')

})

app.post('/register', async (req, res) => {
    try {
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword;

        if (password === confirmpassword) {
            const registeruser = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword

            })
            // console.log(registeruser)

            const token = await registeruser.genrateauthtoken();
            // console.log("token part" + token)

            const registered = await registeruser.save();
            res.status(200).render("index");
            // console.log(registered)
        }

    } catch (error) {
        res.status(200).send(error)
        // console.log('the err page part')
    }

})

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const data = await Register.findOne({ email: email })

        const comparepassword = await bcrypt.compare(password, data.password)

        const token = await data.genrateauthtoken();
        console.log(token)
        // if (data.password === password) {
        if (comparepassword) {
            res.status(200).render("index")
        } else {
            res.status(400).send("login details invalid")
        }


    } catch (error) {

        res.status(400).send(error)
    }

})



app.listen(5000, () => {
    console.log("server run on port no 5000")
})









// const bcrypt = require('bcryptjs');

// const curepassword = async (password) => {
//     const passwordhash = await bcrypt.hash(password, 10);

//     const comparepassword = await bcrypt.compare(password, passwordhash)
//     console.log(comparepassword)

// }

// curepassword("aditya123");




// const createtoken = async () => {
//     const token = await jwt.sign({ _id: "6432ae81d545d473e076eb7f" }, "mynameisadityasonifromsonakhar", { expiresIn: "2 seconds" })
//     console.log(token)

//     const uservarify = await jwt.verify(token, "mynameisadityasonifromsonakhar");
//     console.log(uservarify)

// }

// createtoken()