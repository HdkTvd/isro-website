const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs

const app = express(); // Initialize the express web server
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware
app.use(express.static('public'));

const uploadPath = path.join(__dirname, 'tiffs/'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits


/**
 * Create route /upload which handles the post request
 */
app.route('/upload').post((req, res, next) => {

    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);
            res.redirect('back');
        });
    });
});


/**
 * Serve the basic index.html with upload form
 */
app.route('/').get((req, res) => {
    res.sendFile('index.html', {
        // root: path.join(__dirname, './')
    })
});
app.route('/Services').get((req, res) => {
    res.sendFile('services.html', {
        root: path.join(__dirname, './public/')
    })
});
app.route('/Analysis').get((req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, './public/')
    })
});

const server = app.listen(3200, function () {
    console.log(`Listening on port ${server.address().port}`);
});