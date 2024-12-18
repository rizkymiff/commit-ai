module.exports = async (app) => {
    app.command('set-token <token>')
        .description('Set Google Gemini API token')
        .option('-g, --global', 'Setel token secara global')
        .action((token, option) => {
            const fs = require('fs');
            const path = require('path');
            const os = require('os');
            const dotEnvPath = path.resolve(process.cwd(), '.env');
            const globalEnvPath = path.join(os.homedir(), '.commit-ai-config');

            try {
                let content;
                let saved;
                let savedPlace;

                if(option.global) {
                    if(fs.existsSync(globalEnvPath)) {
                        content = fs.readFileSync(globalEnvPath, 'utf-8');
    
                        if(/GEMINI_TOKEN=.*/.test(content)) {
                            content = content.replace(/GEMINI_TOKEN=.*/, `GEMINI_TOKEN=${token}`);
                        } else {
                            content += `\nGEMINI_TOKEN=${token}`;
                        }
                    } else {
                        content = `GEMINI_TOKEN=${token}`;
                    }
                    saved = 'in global config';
                    savedPlace = globalEnvPath;
                } else {
                    if(fs.existsSync(dotEnvPath)) {
                        content = fs.readFileSync(dotEnvPath, 'utf-8');
    
                        if(/GEMINI_TOKEN=.*/.test(content)) {
                            content = content.replace(/GEMINI_TOKEN=.*/, `GEMINI_TOKEN=${token}`);
                        } else {
                            content += `\nGEMINI_TOKEN=${token}`;
                        }
                    } else {
                        content = `GEMINI_TOKEN=${token}`;
                    }
                    saved = 'in local project';
                    savedPlace = dotEnvPath;
                }

                fs.writeFileSync(savedPlace, content, 'utf-8');
                console.log(`Token saved ${saved} successfully!`);
                console.log(`Saved at ${savedPlace}`);
            } catch (err) {
                console.error('Error saving token:', err);
            }
        })
}