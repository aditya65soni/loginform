const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/loginform").then(() => {
    console.log('mongo connected')
}).catch((err) => {
    console.log(err)
})