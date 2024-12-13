module.exports = async (app) => {
    app.command('set-token <token>')
        .description('Set Google Gemini API token')
        .action((token) => {
            const fs = require('fs');
            const path = require('path');
            const dotEnvPath = path.resolve(process.cwd(), '.env');

            try {
                let content;
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

                fs.writeFileSync(dotEnvPath, content, 'utf-8');
                console.log('Token saved successfully!');
            } catch (err) {
                console.error('Error saving token:', err);
            }
        })
}