const express = require('express');
const { connectDB } = require('./config/database');
const User = require('./models/user');
const cookieParser = require('cookie-parser');

const app = express();

// Now, we apply our middleware here.
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

app.use('/auth', authRouter);

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