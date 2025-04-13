const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                res.status(400).send("Provided email is not a valid email.")
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        // These validators don't run for the update function directly.
        // To run for update too then we have to make the runValidator option true.
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                res.status(400).send("Provided profilePhoto URL is not a valid URL.")
            }
        }
    },
    skills: {
        type: [String]
    },
    about: {
        type: String,
        default: "This is the default about of every user."
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    membershipType: {
        type: String
    },
}, { timestamps: true })

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id }, "dev@tinder", { expiresIn: "1d" });

    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;

    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);

module.exports = User;