const core = require('@actions/core');
const github = require('@actions/github');
// const fetch = require('node-fetch');
const ToSlack = require("./postToHook");


const start_color = '#C8F1F3';
const sucess_color = '#00C0C7';
const cancelled_color = '#FFA900';
const failure_color = '#FF614E';

function getColor(status) {
    
    if (status.toLowerCase() === 'success') {
        return sucess_color;
    }
    if (status.toLowerCase() === 'cancelled') {
        return cancelled_color;
    }
    if (status.toLowerCase() === 'failure') {
        return failure_color;
    }
    return start_color;
}

function getText(status, slackUser) {
    const workflow = github.context.workflow;	
    const actor = github.context.actor;

    let user= "nipitiri" 
    if(slackUser.startsWith("U")){
        user = `<@${slackUser}>`
        console.log(`slackist käivitas<@${slackUser}>`)
    }else{
        user = `<http://github.com/${actor}|${actor}>`
        console.log("pole slackist käivitatud")
    }
    started = `${user} *alustas* ${workflow} ehitamist`
    succeeded = `${user} alustatud ${workflow} ehitamine lõppes *EDUKALT*`
    cancelled = `:warning: ${user} tühistas ${workflow} ehitamise`
    failure = `<!here> ${user} alustatud ${workflow} ehitamine *EBAÕNNESTUS*`
    
    if (status.toLowerCase() === 'success') {
        return succeeded;
    }
    if (status.toLowerCase() === 'cancelled') {
        return cancelled;
    }
    if (status.toLowerCase() === 'failure') {
        return failure;
    }
    if (status.toLowerCase() === 'started') {
        return started;
    }
    return 'status no valido';
}

function getPMText(status, slackUser) {
    const workflow = github.context.workflow;	

    let user= "nipitiri" 
    if(slackUser.startsWith("U")){
        user = `<@${slackUser}>`
        console.log(`slackist käivitas<@${slackUser}>`)
    }else{
        user = `<http://github.com/${req.body.actor}|${req.body.actor}>`
        console.log("pole slackist käivitatud")
    }
    started = `${user}, *alustasid* ${workflow} ehitamist`
    succeeded = `${user}, sinu muudatused on jõudnud *${workflow}* lehele.`
    cancelled = `:warning: ${user},  tühistasid ${workflow} ehitamise`
    failure = `<!here> ${user}, sinu alustatud ${workflow} ehitamine *EBAÕNNESTUS*. Saatsin ebaõnnestumisest arendajate kanalisse ka.`
    
    if (status.toLowerCase() === 'success') {
        return succeeded;
    }
    if (status.toLowerCase() === 'cancelled') {
        return cancelled;
    }
    if (status.toLowerCase() === 'failure') {
        return failure;
    }
    if (status.toLowerCase() === 'started') {
        return started;
    }
    return 'status no valido';
}

function generateSlackMessage(text) {
    const { sha } = github.context;
    const { owner, repo } = github.context.repo;
    const status = core.getInput("status");
    const actor = github.context.actor
    let channel = ""
    let slackUser = ""
    if (core.getInput('privateChannel')){
        channel = core.getInput('privateChannel');
    }
    if(core.getInput('slackUserId')){
        slackUser = core.getInput('slackUserId');
    }

    return {
        user: slackUser,
        channel: channel,
        actor: actor,
        status: status,
        PM: getPMText(status, slackUser),
        text: getText(status, slackUser),
        attachments: [
            {
                fallback: text,
                color: getColor(status),
                ts: Math.floor(Date.now() / 1000),
                "actions": [ 
                    {
                        "type": "button",
                        "text": `${github.context.ref.split("/")[2]} branch`, 
                        "url": `https://github.com/${owner}/${repo}/tree/${github.context.ref.split("/")[2]}` 
                     },
                    {
                       "type": "button",
                       "text": "Commit", 
                       "url": `https://github.com/${owner}/${repo}/commit/${sha}` 
                    },
                    {
                       "type": "button",
                       "text": "Action Tab",
                       "url": `https://github.com/${owner}/${repo}/commit/${sha}/checks` 
                    }                
                ]               
            }
        ]
    };
}

slackUser = core.getInput('slackUserId')
channel = core.getInput('privateChannel');
const payload = JSON.stringify(github.context.payload, undefined, 2)

let simpleData ={
user: slackUser,
channel: channel,
payload: payload,
text: "heureka foo bar"
}


try {
    //ToSlack.POST(generateSlackMessage('Sending message'));
    ToSlack.POST(simpleData);
} catch (error) {
    console.log(error)
  core.setFailed(`[Error] There was an error when sending the slack notification`);
} 