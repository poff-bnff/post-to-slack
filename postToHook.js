const https = require('follow-redirects').https;
const fs = require('fs');



function POSTtoSlack (data){

    let options = {
        'method': 'POST',
        'hostname': 'excited-foamy-trigonometry.glitch.me',
        'path': '/hook',
        'headers': {
            "User-Agent": "PostmanRuntime/7.26.3",
            'Content-Type': 'application/json'
        },
        'maxRedirects': 20
    };
    
    const req = https.request(options, (res) => {
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
        });
    });
    
    let postData = JSON.stringify(data);
    
    req.write(postData);
    
    req.end();

}

module.exports.POST = POSTtoSlack