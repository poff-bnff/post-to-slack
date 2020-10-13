const http = require('follow-redirects').http;
const fs = require('fs');

function POSTtoSlack (data){

    let options = {
        'method': 'POST',
        'hostname': 'slackapp.poff.ee',
        'path': '/hook',
        'headers': {
            'Content-Type': 'application/json'
        },
        'maxRedirects': 20
    };
    
    const req = http.request(options, (res) => {
        let chunks = [];
    
        res.on("data", (chunk) => {
            chunks.push(chunk);
        });
    
        res.on("end", (chunk) => {
            let body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    
        res.on("error", (error) => {
            console.error(error);
            console.log("post päringus on error")
        });
    });
    
    let postData = JSON.stringify(data);
    
    req.write(postData);
    
    req.end();

}

module.exports.POST = POSTtoSlack