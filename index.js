const core = require('@actions/core');
const github = require('@actions/github');
// const fetch = require('node-fetch');
const ToSlack = require("./postToHook");

const start_color = '#C8F1F3';
const sucess_color = '#228C22';
const cancelled_color = '#FFA900';
const failure_color = '#DF2800';


const payload = github.context.payload

let job = payload.inputs.job

let privateChannel = ""
let slackUserId= ""
if(payload.hasOwnProperty('inputs')){
    privateChannel = payload.inputs.privateChannel
    slackUserId = payload.inputs.slackUserId
}


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

function getText(status) {
    const workflow = github.context.workflow;	
    const actor = github.context.actor;
    let user

    if(slackUserId.startsWith("U")){
        user = `<@${slackUserId}>`
        console.log(`slackist käivitas<@${slackUserId}>`)
    }else{
        user = `<http://github.com/${actor}|${actor}>`
        console.log("pole slackist käivitatud")
    }
    started = `${user} *alustas* ${workflow} ehitamist`
    succeeded = `${user} alustatud ${workflow} ehitamine lõppes *EDUKALT*`
    cancelled = `:warning: ${user} tühistas ${workflow} ehitamise`
    failure = `:bangbang: ${user} alustatud ${workflow} ehitamine *EBAÕNNESTUS*`
    
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

function getPMText(status) {
    const workflow = github.context.workflow;
    const actor = github.context.actor;
    let user
    if(slackUserId.startsWith("U")){
        user = `<@${slackUserId}>`
        console.log(`slackist käivitas<@${slackUserId}>`)
    }else{
        user = `<http://github.com/${actor}|${actor}>`
        console.log("pole slackist käivitatud")
    }
    started = `${user}, *alustasid* ${workflow} ehitamist`
    succeeded = `${user}, sinu muudatused on jõudnud ${workflow} lehele.`
    cancelled = `:warning: ${user},  tühistasid ${workflow} ehitamise`
    failure = `:disappointed_relieved: ${user}, sinu alustatud ${workflow} ehitamine *EBAÕNNESTUS*. Saatsin ebaõnnestumisest teate arendajate kanalisse.`
    
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


    console.log( "generate message sees", slackUserId, privateChannel)
    // console.log("see on job", job)

    return {
        user: slackUserId,
        channel: privateChannel,
        actor: actor,
        status: status,
        PM: getPMText(status),
        text: getText(status),
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

try {
    ToSlack.POST(generateSlackMessage('Sending message'));
    //ToSlack.POST(simpleData);
} catch (error) {
    console.log(error)
  core.setFailed(`[Error] There was an error when sending the slack notification`);
} 