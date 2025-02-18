const express = require('express');

const app = express();

// We can also handle route handlers in this way.
app.get('/user', (req, res, next) => {
    next();
});

app.get('/user', (req, res) => {
    res.send("Hello World!");
})

// But why we require so many functions to handle a single route?
// Because we have to many tasks in a single route, so we have to break it down into multiple functions.
// This makes the code more readable and maintainable.

// The last function in the chain is the one that sends the response to the client is called as request handler.
// And all the middle functins are called as middlewares.

// Now suppose, you have multiple routes, and you want that only authenticated users can access those routes.
// So, you have to write the authentication code in every route handler.
// This will make the code redundant and difficult to maintain.
// So, we can use middlewares to solve this problem.

// Now, how to use middlewares in our application?
// Suppose, we want that only admin can access the /admin route.

app.use('/admin', (req, res, next) => {
    const token = "xyz";
    const authenticated = token === 'xyz';
    if (authenticated) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
});

app.get('/admin/getAllData', (req, res) => {
    res.send("Admin got all data!");
});

app.post('/admin/createData', (req, res) => {
    res.send("Admin created something!");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});