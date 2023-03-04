import http from 'http';
import fetch from 'node-fetch';
// import file system to read and serve static files on vanilla server
import fs from 'fs';


const server = http.createServer((request, response) => {
    let url = request.url;
    let tableData = "<table border='1'; style='margin-left:auto; margin-right:auto'><tr><th>Name</th><th>Height</th><th>Birth Year</th><th>Gender</th><th>Films</th><th>URL</th></tr>";

    // simple routes
    if (url === '/') {
        fs.readFile('home.jpeg', function (err, data) {
            if (err) throw err // Fail if the file can't be read.
            response.writeHead(200, { 'Content-Type': 'text/html' })
            // response.end(data) // Send the file data to the browser.

            response.write('<html><body style="text-align:center"><h1>Welcome To The Home Page Relax And Keep Going...</h1><img width="70%" height="70%" src="data:image/jpeg;base64,')
            // converts the jpeg file into a string for proper reading
            response.write(Buffer.from(data).toString('base64'));
            response.end('"/></body></html>');
        })
    }

    else if (url === '/list') {

        fetch('https://swapi.dev/api/people')
            // convert returned data to json 
            .then(response => response.json())
            // once converted retrieve the actual data
            .then(data => {
                // actual data we want...being read
                createData(data);
                response.write("<h1 style='text-align:center;'>SWAPI API DATA</h1>")
                // write what is being returned from above
                response.write(tableData);
                response.end();
            });
    } else {
        // response.writeHead(404, { 'Content-Type': 'text/html' })
        // response.write("<h1>Page Not Found</h1>")
        // response.end();

        fs.readFile('error.jpeg', function (err, data) {
            if (err) throw err
            response.writeHead(404, { 'Content-Type': 'text/html' })

            response.write('<html><body><h1>Page Not Found</h1><img width="90%" height="90%" src="data:image/jpeg;base64,')
            response.write(Buffer.from(data).toString('base64'));
            response.end('"/></body></html>');
        })
    }

    function createData(data) {
        // console.log(data.results);
        data.results.forEach(element => {
            tableData += `<tr><td>${element.name}</td><td>${element.height}</td><td>${element.birth_year}</td><td>${element.gender}</td><td>${element.films.slice(0, 2)}</td><td>${element.url}</td></tr>`
        });
        tableData += `</table>`
    };

}).listen(8090, console.log(`Server is listening on Port 8090`));