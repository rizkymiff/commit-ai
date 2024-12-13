#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path')
const dotEnv = require('dotenv');

dotEnv.config();

const app = new Command();

const commandsPath = path.resolve(__dirname, './commands');
fs.readdirSync(commandsPath).forEach((file) => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsPath, file));
    command(app);
  }
});

app.parse(process.argv);