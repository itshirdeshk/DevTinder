const express = require('express');
const { connectDB } = require('./config/database');
const User = require('./models/user');

const app = express();

app.post('signup', async (req, res) => {
    const userObj = {
        firstName: "Hirdesh",
        lastName: "Khandelwal",
        emailId: "hirdeshkhandelwal58@gmail.com",
        password: "hirdesh@123"
    }
    // Now, we have to save the data in the db.
    // For that, we have to import the User model.
    // Then, we have to create a new instance of the user model.

    try {
        const user = new User(userObj);
        // Now, we have to save the user in the db.
        await user.save();

        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error while creating user");
    }
})

connectDB().then(() => {
    // Our database should connected first before we start the server
    console.log('Database connected')
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
    .catch(err => {
        console.error('Database cannot be connected', err);
    });