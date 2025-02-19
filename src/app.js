const express = require('express');
const { connectDB } = require('./config/database');
const User = require('./models/user');

const app = express();

// Now, we apply our middleware here.
app.use(express.json());

app.post('signup', async (req, res) => {
    // Now, we will see how we can data from the user.
    // So, for getting the data, user have to send the data in the body of the request.
    // But we can't get the data directly from the body of the request.
    // Because it is in the JSON format.

    // So, we require to use a middleware or a package which can parse the JSON data.
    // We generally use a package that itself provided by the express that is express.json().

    try {
        const user = new User(req.body);
        // Now, we have to save the user in the db.
        await user.save();

        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error while creating user");
    }

})

// Get user by emailId - GET /user
app.get('/user', async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        if (!user) res.send("User not found");

        res.send(user);
    } catch (error) {
        res.status(404).send("Error while getting user");
    }
})

// Feed API - GET /feed - get all the users from the database.
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(404).send("Error while getting users");
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