First enable the Dialogflow API for each project:
https://console.developers.google.com/apis/api/dialogflow.googleapis.com/overview?project=<YOURPROJECT>

Make sure you have a serviceAccount.json with Dialogflow API Admin access to your projects.

Usage:

    ./dftool.js export my-dev-project

This creates a `dialogflow` directory with an export of the intents and config from `my-dev-project`. It strips out `googleAssistant.project` and `webhook.url` since they are project dependent. You can commit this `dialogflow` directory to Git.

    ./dftool.js import my-prod-project https://us-central1-my-prod-project.cloudfunctions.net/fulfillment

This takes the `dialogflow` directory, sets proper values for `googleAssistant.project` and `webhook.url` and imports it to `my-prod-project`.

Note that this project still uses Node 6 since you also need that for Google Cloud Functions.
