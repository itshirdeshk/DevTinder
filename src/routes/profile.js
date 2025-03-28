const express = require('express');
const { userAuth } = require('../middleware/auth');
const { validateProfileEditData } = require('../../utils/validation');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

app.get('/view', userAuth, async (req, res) => {
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

app.patch('/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit Data");
        };

        const loggedInUser = req.user;

        Object, keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();

        res.json({ message: `${loggedInUser.firstName} ${loggedInUser.lastName}, your profile updated successfully.`, data: loggedInUser });
    } catch (error) {
        res.status(400).send("ERROR: ", error.message);
    }
})

app.patch('/password', userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw new Error("Both old password and new password are required");
        }

        if (oldPassword === newPassword) {
            throw new Error("New password should not be same as old password");
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, loggedInUser.password);

        if (!isPasswordValid) {
            throw new Error("Old password is incorrect");
        }

        const isStrongPassword = validator.isStrongPassword(newPassword);

        if (!isStrongPassword) {
            throw new Error("New password is not strong");
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        const loggedInUser = req.user;
        loggedInUser.password = newHashedPassword;

        loggedInUser.save();

        res.json({ message: `${loggedInUser.firstName} ${loggedInUser.lastName}, your password updated successfully.` });
    } catch (error) {
        return res.status(400).send("ERROR: ", error.message);
    }
})

module.exports = router;