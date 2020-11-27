const https = require('follow-redirects').https;
const fs = require('fs');

function POSTtoSlack (data){

    let options = {
        'method': 'POST',
        'hostname': 'chat.poff.ee',
        'path': '/slack/hook',
        'headers': {
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
            console.log("post päringus on error")
        });
    });
    console.log ("data jõudis postToHook funktsiooni", data)
    
    let postData = JSON.stringify(data);
    
    req.write(postData);
    
    req.end();

}

module.exports.POST = POSTtoSlack
