const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, resizeBy, next) => {
    try {
        // Read the token from the req cookies
        const { token } = req.cookies;
    
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
    
        // Validate the token
        const decodedData = jwt.verify(token, "dev@tinder");
    
        if(!decodedData) {
            return res.status(401).send("Unauthorized"); 
        }
    
        const { _id } = decodedData;
    
        const user = await User.findById(_id);
    
        if(!user) throw new Error("User not found");

        req.user = user; // Set the user object on the request object for further use
    
        next();
    } catch (error) {
        return res.status(400).send("ERROR: ", error.message);
    }
}

module.exports = { userAuth };