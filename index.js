const core = require('@actions/core');
const github = require('@actions/github');
const ToSlack = require("./postToHook");

try {
  // `who-to-greet` input defined in action metadata file
  const user = core.getInput('slackUserId');
  console.log(`Hello ${user}!`);

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);

  // Get the JSON webhook payload for the event that triggered the workflow

  const payload = JSON.stringify(github.context.payload, undefined, 2)

  let data ={
    "user": payload.inputs.user,
    "sender": payload.sender.login
  }

  console.log("see on minu action olemas")
  console.log(`The event payload: ${payload}`);

  ToSlack.POST(data)

} catch (error) {
  core.setFailed(error.message);
}
