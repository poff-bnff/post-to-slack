const core = require('@actions/core');
const github = require('@actions/github');
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

// intagrations channelisse läheb sõnum webhook-iga, siis peaks saama kätte ka failed jne
function post(slackMessage) {
  const slack_webhook_url = core.getInput("slack_webhook_url");
  fetch(slack_webhook_url, {
    method: 'POST',
    body: JSON.stringify(slackMessage),
    headers: {
      'Content-Type': 'application/json'
    },
  }).catch(console.error);

  if (!core.getInput("slack_webhook_url")) {
    try {
      throw new Error(`[Error] Missing Slack Incoming Webhooks URL
         Please configure "SLACK_WEBHOOK" as environment variable or
         specify the key called "slack_webhook_url" in "with" section`);
    } catch (error) {
      console.error(error.message);
    }
  }
}









try {
  // input defined in action metadata file
  const user = core.getInput('slackUserId'); //console.log(`User: ${user}!`);
  const channel = core.getInput('privateChannel'); //console.log(`Channel: ${user}!`);
  const status = core.getInput('status');
  const actor = github.context.actor
  const workflow = github.context.workflow
  const {
    sha
  } = github.context;
  const {
    owner,
    repo
  } = github.context.repo;

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  let repository = `https://github.com/${owner}/${repo}|${owner}/${repo}`
  let commit = `https://github.com/${owner}/${repo}/commit/${sha}`
  let actiontab = `https://github.com/${owner}/${repo}/commit/${sha}/checks`


  function makeData(customText) {
    let data = {
      "user": user,
      "channel": channel,
      "actor": actor,
      "workflow": workflow,
      "status": status,
      "text": customText,
      "repo": repository,
      "commit": commit,
      "actiontab": actiontab
    }
    return data
  }

  console.log("see on minu action muutustega")
  console.log(`The event payload: ${payload}`);

  //ToSlack.POST(data)
  if (status.toLowerCase() === 'success') {
    
    ToSlack.POST(makeData("Õnnestus"))
    console.log("Õnnestus")
  }
  if (status.toLowerCase() === 'cancelled') {
    
    ToSlack.POST(makeData("Tühistatud"))
    console.log("Tühistatud")
  }
  if (status.toLowerCase() === 'failure') {
    
    ToSlack.POST(makeData("Feilis"))
    console.log("Fail")
  }
  if (status.toLowerCase() === 'started') {
    
    ToSlack.POST(makeData("Algas"))
    console.log("algas")
  }

} catch (error) {
  core.setFailed(`[Error] There was an error when sending the slack notification`);
}

function getText(status) {
  const actor = github.context.actor;
  const workflow = github.context.workflow;
  started = `<http://github.com/${actor}|${actor}>` + ' has *started* the "' + `${workflow}` + '"' + ' workflow ';
  succeeded = 'The workflow "' + `${workflow}` + '"' + ' was completed *successfully* by ' + `<http://github.com/${actor}|${actor}>`;
  cancelled = ':warning: The workflow "' + `${workflow}` + '"' + ' was *canceled* by ' + `<http://github.com/${actor}|${actor}>`;
  failure = '<!here> The workflow "' + `${workflow}` + '"' + ' *failed*';

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