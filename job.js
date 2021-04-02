// tslint:disable
/* eslint-disable */
const fs = require('fs');

const updateConfig = (environment = 'default') => {
  const envFolder = `environments/${environment}`;
  const copyTasks = [
    {
      src: `${envFolder}/override.config.ts`,
      des: `src/config/override.config.ts`,
    },
  ];
  for (const copyTask of copyTasks) {
    if (!fs.existsSync(copyTask.src)) {
      continue;
    }
    fs.copyFileSync(copyTask.src, copyTask.des);
    console.log(`Copied "${copyTask.src}" to "${copyTask.des}"`);
  }
};

const run = () => {
  const command = process.argv[2];
  updateConfig(command);
};

run();
