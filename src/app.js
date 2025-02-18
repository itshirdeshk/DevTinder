const express = require('express');

const app = express();

// Suppose you got error in your functions, then if you don't handle it, it will give error in the way, that the user or client will not understand and also it will expose many other things.
// Also, it will stop the server from running.
// That's why always use try-catch block to handle the errors.
app.get('/getUserData', (req, res) => {
    throw new Error("Error in getUserData route");
    res.send('User data');
})

// Also, we can handle errors using error handling middleware.
// This middleware will catch all the errors that are thrown in the application.
// It will catch the error and send the response to the client.

// We get another argument in the route handler function other than req, res and next that is err.
// That is used to catch the error.

// Express makes these arguments are very dynamic.
// If we pass 2 arguments in the route handler function, then it will consider the first argument as req and the second argument as res.
// If we pass 3 arguments, then it will consider the first argument as req, the second argument as res and the third argument as next.
// If we pass 4 arguments, then it will consider the first argument as err, the second argument as req, the third argument as res and the fourth argument as next.
app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("Something went wrong");
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});