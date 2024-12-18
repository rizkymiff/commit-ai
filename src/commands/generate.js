const fs = require('fs');

module.exports = async (app) => {
    app.command('generate')
        .description('Generate commit with google gemini ai')
        .option('-ac, --auto-commit', '')
        .action(async (option) => {
            try {
                const simpleGit = require('simple-git');
                const git = simpleGit()
                const axios = require('axios');
                const inquirer = require('inquirer');
                const path = require('path');
                const os = require('os');
                const globalConfig = path.join(os.homedir(), '.commit-ai-config');
        
                let geminiToken;
                if(fs.existsSync(globalConfig) && !process.env.GEMINI_TOKEN) {
                    const config = fs.readFileSync(globalConfig, 'utf-8');
                    const match = config.match(/GEMINI_TOKEN=(.*)/);
                    if(match) geminiToken = match[1];
                } else if (!fs.existsSync(globalConfig) && process.env.GEMINI_TOKEN) {
                    geminiToken = process.env.GEMINI_TOKEN;
                } else {
                    console.error('Error: GEMENI_TOKEN is not set. Use "commit-ai set-token <token>" to set it.');
                    process.exit(1);
                }
                
                const diff = await git.diff(['--cached', '--diff-algorithm=minimal']);
                if (!diff) {
                    console.log('No changes detected.');
                    process.exit(1);
                }

                const fileUpdate = await git.diff(['--cached', '--name-only']);

                let commitMessage;

                const prompt = fs.readFileSync(__dirname+"/../prompts/prompt.txt");
                const updateType = require('../configs/types.json');

                let geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';

                const generateCommit = async () => {
                    console.log("Generating commit message ...");
                    const payload = {
                        contents: [
                            {
                                parts: [{
                                    text: prompt.toString().replace('#type', JSON.stringify(updateType)).replace('#updateDiff', diff).replace('#files', fileUpdate)
                                }]
                            }
                        ]
                    }
                    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiToken}`, payload);
                    if (response.status !== 200) {
                        process.exit(1);
                    }
                    return response.data.candidates[0].content.parts[0].text;
                }
                commitMessage = await generateCommit();

                if(option.autoCommit) {
                    await git.commit(commitMessage.trim());
                    console.log(`Successfully commited with: \n"${commitMessage.trim()}"`);
                    process.exit(1);
                } else {
                    do {
                        const { userChoice } = await inquirer.prompt([{
                            type: 'list',
                            name: 'userChoice',
                            message: `Generated commit message:\n\n"${commitMessage.trim()}" \n\nDo you want to use this commit message?`,
                            choices: ['Yes', 'No', 'Regenerate'],
                        }]);
        
                        if (userChoice == 'Yes') {
                            await git.commit(commitMessage.trim());
                            console.log(`Successfully commited with: \n"${commitMessage.trim()}"`);
                            process.exit(1);
                        } else if (userChoice == 'No') {
                            console.log('Commit aborted. You can try again.');
                            process.exit(1);
                        } else {
                            console.log('Regenerating commit message...');
                        }
                    } while (true);
                }

            } catch (err) {
                console.error('Error generating commit message:', err.message);
                process.exit(1)
            }
        })
}