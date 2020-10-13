const core = require('@actions/core');
const github = require('@actions/github');
const ToSlack = require("./postToHook");

try {
  // `who-to-greet` input defined in action metadata file
  const user = core.getInput('slackUserId');
  console.log(`User: ${user}!`);
  const channel = core.getInput('privateChannel');
  console.log(`Channel: ${user}!`);

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);

  // Get the JSON webhook payload for the event that triggered the workflow

  const payload = JSON.stringify(github.context.payload, undefined, 2)


  const status = core.getInput("status");
  let statusText = getText(status)

  let data ={
    "user": user,
    "sender": payload.sender.login,
    "channel": channel,
    // "commit": payload,
    // "action": payload,
    // "workflow": payload,

  }

  console.log("see on minu action muutustega")
  console.log(`The event payload: ${payload}`);

  ToSlack.POST(data)

} catch (error) {
  core.setFailed(error.message);
}

function getText(status) {
  const actor = github.context.actor;
  const workflow = github.context.workflow;	
  started = `<http://github.com/${actor}|${actor}>` + ' has *started* the "' + `${workflow}`  + '"' + ' workflow ';
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
