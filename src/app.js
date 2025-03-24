const express = require('express');
const { connectDB } = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middleware/auth');

const app = express();

// Now, we apply our middleware here.
app.use(express.json());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
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
        res.status(400).send("Error while getting users");
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        // const { token } = req.cookies;

        // // Validate the token
        // const decodedData = jwt.verify(token, "dev@tinder");

        // if (!decodedData) {
        //     return res.status(401).send("Unauthorized");
        // }

        // const { _id } = decodedData;

        // const user = await User.findById(_id);

        // if(!user) throw new Error("User not found");

        const user = req.user;

        res.send(user);
    } catch (error) {
        return res.status(400).send("ERROR: ", error.message);
    }
})

// Delete API - DELETE /user - delete the user by ID.
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        // There are two ways to pass the id of the user.
        // First one in which we pass the id directly in the function.
        const user = await User.findByIdAndDelete(userId);

        // Second one in which we pass the id in the object.
        // const user = await User.findByIdAndDelete({_id: userId});

        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Error while deleting user");
    }
})

// Update the user by ID
app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const updateData = req.body;

    try {
        const ALLOWED_UPDATES = [
            "profilePhoto", "about", "gender", "age", "skills"
        ]

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            res.status(400).send("Update is not allowed");
        }

        if (updateData?.skills?.length > 5) {
            res.status(400).send("Skills should be less than or equal to 6");
        }

        const user = await User.findByIdAndUpdate(userId, updateData);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Error while updating user");
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