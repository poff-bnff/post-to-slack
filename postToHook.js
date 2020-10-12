const https = require('follow-redirects').https;
const fs = require('fs');



function POSTtoSlack (userId, payload){

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
    
    let postData = JSON.stringify({
        "id": "best data",
        "buildNumber": 91,
        "startTime": 1602285279245,
        "initiator": "GitHub-Hookshot/4772ab2",
        "commit": "a3fadac76439edce75b4c2ca6f3634b0d05af471",
        "domain": "poff.ee",
        "user": userId,
        "succeeding": 1, 
        "data": payload
    });
    
    req.write(postData);
    
    req.end();

}

module.exports.POST = POSTtoSlack