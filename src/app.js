const express = require('express');

const app = express();

// This will only handle GET requests to the /user route.
app.get('/user', (req, res) => {
    res.send({
        firstName: "Hirdesh",
        lastName: "Khandelwal"
    });
});

app.post('/user', (req, res) => {
    res.send("Data successfully saved to the DB");
});

// This will handle all requests to the /user route.
app.use('/test', (req, res) => {
    res.send("Hello from Test");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});