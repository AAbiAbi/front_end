const express = require('express');
const app = express();
const port = 8081; // Choose a suitable port number
const mime = require('mime');

// Define MIME type for .mjs files
mime.define({
    'application/javascript': ['mjs']
}, { force: true });

app.get('/favicon.ico', (req, res) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  
    //const filePath = path.join(__dirname, 'favicon.ico');
    res.sendFile(__dirname + '/favicon.ico');
  });

const cors = require('cors');

// Set Content Security Policy header
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

app.use(cors());


app.use(express.static('public'));



// Set the MIME type for CSS files
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.type('text/css');
  }
  next();
});

// Serve static files (client-side code)
app.use(express.static('public')); // Assuming your client-side code resides in a 'public' folder

// Serve the Chord.mjs module
app.get('/Chord.mjs', (req, res) => {
    res.sendFile(__dirname + '/Chord.mjs');
});

// Define server-side routes
app.get('/api/posts', (req, res) => {
    // Handle the API request and send the response
});

app.post('/api/posts', (req, res) => {
    // Handle the API request to create a new blog post
});

// Start the server
app.listen(8080, () => {
    console.log(`Server is listening on port 8080`);
});

