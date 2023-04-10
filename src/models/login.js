require('dotenv').config()
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const registrationSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});
// token genration

registrationSchema.methods.genrateauthtoken = async function () {
    console.log(this._id);
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        // console.log(this.tokens)
        // console.log(token)
        return token
    } catch (error) {
        res.send("this eroor part " + error);
        // console.log("this eroor part " + error);
    }
}




// password hashing
registrationSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }

    // this.confirmpassword = undefined;

    next();
});

const Register = new mongoose.model("Register", registrationSchema);

module.exports = Register;







// registrationSchema.pre('save', async function (next) {

//     if (this.isModified('password')) {
//         console.log(`the pass changed into ${this.password}`);
//         this.password = await bcrypt.hash(this.password, 10)
//          console.log(`the pass changed into ${this.password}`);
//     }
//     this.confirmpassword = undefined;
//     next();
// })
