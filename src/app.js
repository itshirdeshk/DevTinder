const express = require('express');

const app = express();

app.use('/user', (req, res) => {
    // What if we don't send anything back?
    // Then the request will hang until it times out.
})

// What will happen in the below code?
// It will give use 'Response 1' as output.
// Because the first request handler handles the request and sends the response.
app.use('/user',
    (req, res) => {
        res.send("Response 1");
    },
    (req, res) => {
        res.send("Response 2");
    }
)

// So, to pass the request to the next handler, we need to call next() function.
// We get a third argument in the request handler function which is next.
app.use('/user',
    (req, res, next) => {
        // What if we don't send anything back?
        // Then the request will hang until it times out.

        // res.send("Response 1");
        next();
    },
    (req, res) => {
        res.send("Response 2");
    }
)

// What happens if we send the respons from the first request handler and then also call next()?
// We will get an error saying 'Cannot set headers after they are sent to the client'.
app.use('/user',
    (req, res, next) => {
        // What if we don't send anything back?
        // Then the request will hang until it times out.

        res.send("Response 1");
        next();
    },
    (req, res) => {
        res.send("Response 2");
    }
)

// What happens if we called next() but there is no request handler?
// We will get an error saying 'Cannot GET /user'.
app.use('/user',
    (req, res, next) => {
        // What if we don't send anything back?
        // Then the request will hang until it times out.

        // res.send("Response 1");
        next();
    },
    (req, res) => {
        // res.send("Response 2");
        next();
    }
)

// We can also give array of route handlers.
app.use('/user', [rh1, rh2, rh3]);

// OR

// We can also do this way.
app.use('/user', [rh1, rh2], rh3);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});