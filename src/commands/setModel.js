module.exports = async (app) => {
    app.command('set-model <token>')
        .description('Set Google Gemini AI Model')
        .action((model) => {
            const fs = require('fs');
            const path = require('path');
            const dotEnvPath = path.resolve(process.cwd(), '.env');

            try {
                let content;
                if(fs.existsSync(dotEnvPath)) {
                    content = fs.readFileSync(dotEnvPath, 'utf-8');

                    if(/GEMINI_MODEL=.*/.test(content)) {
                        content = content.replace(/GEMINI_MODEL=.*/, `GEMINI_MODEL="${model}"`);
                    } else {
                        content += `\nGEMINI_MODEL="${model}"`;
                    }
                } else {
                    content = `GEMINI_MODEL="${model}"`;
                }

                fs.writeFileSync(dotEnvPath, content, 'utf-8');
                console.log('Model saved successfully!');
            } catch (err) {
                console.error('Error saving model:', err);
            }
        })
}