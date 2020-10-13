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
    const actor = github.context.actor;
    const workflow = github.context.workflow;	

    let user= "nipitiri" 
    if(slackUser.startsWith("U")){
        user = `<@${slackUser}>`
        console.log(`slackist käivitas<@${slackUser}>`)
    }else{
        user = `<http://github.com/${req.body.actor}|${req.body.actor}>`
        console.log("pole slackist käivitatud")
    }
    started = user + ' has *started* the "' + `${workflow}`  + '"' + ' workflow ';
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

function generateSlackMessage(text) {
    const { sha } = github.context;
    const { owner, repo } = github.context.repo;
    const status = core.getInput("status");
    const actor = github.context.actor
    const channel = core.getInput('privateChannel');
    const slackUser = core.getInput('slackUserId');

    return {
        user: slackUser,
        channel: channel,
        actor: actor,
        status: status,
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


try {
    ToSlack.POST(generateSlackMessage('Sending message'));
} catch (error) {
  core.setFailed(`[Error] There was an error when sending the slack notification`);
} 