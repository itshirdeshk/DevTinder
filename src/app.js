const express = require('express');

const app = express();

// This routes makes the letter 'b' optional in the URL
// So, both /ac and /abc will work
app.get('/ab?c', (req, res) => {
    res.send('ab?c');
})

// Here, bc becomes optional.
app.get('/a(bc)?d', (req, res) => {
    res.send('ab?c');
})

// So, by using '+', we can make the letter 'b' repeatable
app.get('/ab+c', (req, res) => {
    res.send('ab?c');
})

// So, here '*' denotes that anything can come on its place as long as it starts with 'ab' and ends with 'c'
app.get('/ab*c', (req, res) => {
    res.send('ab?c');
})

// We can also write regex instead of the string
// Here, the URL should contain 'a' and anything can come anywhere
app.get(/a/, (req, res) => {
    res.send('a');
})

// Here, the URL should contain 'fly' at the end
app.get(/.*fly$/, (req, res) => {
    res.send('a');
})

// Dynamic Routing
app.get('/users/:userId', (req, res) => {
    res.send(req.params);
})

app.get('/users/:userId/:bookId', (req, res) => {
    res.send(req.params);
})

// Quuery Params
app.get('/users', (req, res) => {
    res.send(req.query);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});