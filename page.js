
const express = require("express");
const app = express();
const bodyParser = require('body-parser'); // Corrected the import name
const Student = require("./mongoose"); // Changed variable name for consistency
const encoded = bodyParser.urlencoded({ extended: false }); // Corrected the variable name
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', encoded, async (req, res) => {
    try {
        // Create a new Student instance with the data from the request body
        let student = new Student(req.body);
        // Save the student to the database
        await student.save();
        res.send(`
            <h2>User registered successfully!</h2>
            <p>Click <a href="/login">here</a> to login or click <a href="/">here</a> to register another user.</p>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/login', (req, res) => {
    console.log("hey");
    res.sendFile(__dirname + '/login.html');
});

app.post('/loggedin', encoded, async (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body
    try {
        // Find a student with the given username and password in the database
        const student = await Student.findOne({ username: username, password: password });
        if (student) {
            // If user exists, redirect to dashboard
            res.redirect('/dashboard');
        } else {
            // If user doesn't exist, send error message
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        // Handle server errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.listen(5000, () => {
    console.log("Server is running on port 5000"); // Corrected the port number in the log message
});
