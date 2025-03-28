const express = require('express');
const { validateSignUpData } = require('../../utils/validation');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    // Now, we will see how we can data from the user.
    // So, for getting the data, user have to send the data in the body of the request.
    // But we can't get the data directly from the body of the request.
    // Because it is in the JSON format.

    // So, we require to use a middleware or a package which can parse the JSON data.
    // We generally use a package that itself provided by the express that is express.json().

    // There are many remaining things that we have to do.

    // We have to validate the data.
    // Then, we have to encrypt the password.


    try {
        // We have to validate the data.
        validateSignUpData(req);

        // Then, we have to encrypt the password.
        const hashedPassword = await bcrypt.hash(req.body.password, 10);


        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: hashedPassword
        });
        // Now, we have to save the user in the db.
        await user.save();

        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error:", error.message);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            throw new Error("Password is incorrect");
        }

        // Now, we have to create a token.
        // We have to use a package that is jsonwebtoken.

        const token = await user.getJWT();

        // Add the token to cookie and send it back to the user.
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        res.send("User logged in successfully");
    } catch (error) {
        res.status(400).send("Error:", error.message);
    }
})

router.post('/logout', (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("User logged out successfully");
})

module.exports = router;