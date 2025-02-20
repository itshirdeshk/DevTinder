const mongoose = require('mongoose');

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
        lowercase: true
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
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    profilePhoto: {
        type: String
    },
    skills: {
        type: [String]
    },
    about: {
        type: String,
        default: "This is the default about of every user."
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User;