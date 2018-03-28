const fs = require('fs');
const { exec } = require('child_process');
const dialogflow = require('dialogflow');

const client = new dialogflow.AgentsClient({
  keyFilename: 'serviceAccount.json'
});

// No async & await cause of Node 6

function dfExport(fromProject) {
  client.exportAgent({parent: 'projects/' + fromProject})
    .then(([operation]) => {
      // Operation#promise starts polling for the completion of the Long Running Operation:
      return operation.promise();
    })
    .then(([result]) => {
      console.log('Writing export.zip');
      return new Promise((resolve, reject) => {
        fs.writeFile('export.zip', result.agentContent, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    })
    .then(() => {
      console.log('Unzipping and deleting the zip');
      return new Promise((resolve, reject) => {
        exec('unzip -o export.zip -d dialogflow && rm export.zip', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    })
    .then(() => {
      console.log('Reading agent.json');
      return new Promise((resolve, reject) => {
        fs.readFile('dialogflow/agent.json', 'utf8', (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    })
    .then(file => {
      console.log('Cleaning agent.json project and webhook url');
      const agent = JSON.parse(file);
      agent.googleAssistant.project = '<PLACEHOLDER>';
      agent.webhook.url = '<PLACEHOLDER>';
      return new Promise((resolve, reject) => {
        fs.writeFile('dialogflow/agent.json', JSON.stringify(agent), (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    })
    .catch(err => {
      console.error(err);
    });
}
function dfImport(toProject, webhookUrl) {
  console.log('Reading agent.json');
  new Promise((resolve, reject) => {
    fs.readFile('dialogflow/agent.json', 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  }).then(file => {
    console.log('Setting agent.json project and webhook url');
    const agent = JSON.parse(file);
    agent.googleAssistant.project = toProject;
    agent.webhook.url = webhookUrl;
    return new Promise((resolve, reject) => {
      fs.writeFile('dialogflow/agent.json', JSON.stringify(agent), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }).then(() => {
    console.log('Zipping to import.zip');
    return new Promise((resolve, reject) => {
      exec('rm import.zip; cd dialogflow; zip -r ../import.zip *; cd ..', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }).then(() => {
    console.log('Reading import.zip');
    return new Promise((resolve, reject) => {
      fs.readFile('import.zip', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }).then(data => {
    console.log('Restoring to project ' + toProject);
    return client.restoreAgent({
      parent: 'projects/' + toProject,
      agentContent: data.toString('base64')
    });
  }).then(([operation]) => {
    // Operation#promise starts polling for the completion of the Long Running Operation:
    return operation.promise();
  }).then(() => {
    console.log('Deleting import.zip');
    return new Promise((resolve, reject) => {
      exec('rm import.zip', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }).catch(err => {
    console.error(err);
  });
}

module.exports = { dfExport, dfImport };
