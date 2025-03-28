const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    
    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    } 
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
}

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"];

    const isEditAllowed = Object.keys(req.body).every((field) => {
        return allowedEditFields.includes(field);
    });

    return isEditAllowed;
}

module.exports = { validateSignUpData, validateProfileEditData };