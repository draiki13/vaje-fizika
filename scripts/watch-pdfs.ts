import { watch } from 'fs';
import { exec } from 'child_process';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');
const scriptPath = path.join(process.cwd(), 'scripts', 'generate-pdfs.ts');

console.log(`👀 Watching for changes in ${contentDir}...`);

let timeout: NodeJS.Timeout | null = null;

watch(contentDir, { recursive: true }, (event, filename) => {
    if (filename && filename.endsWith('.mdx')) {
        console.log(`📄 Change detected in ${filename}`);

        // Debounce to avoid multiple runs
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            console.log('🚀 Re-generating PDFs...');
            exec(`npx tsx ${scriptPath}`, (err, stdout, stderr) => {
                if (err) {
                    console.error(`❌ Error: ${err.message}`);
                    return;
                }
                console.log(stdout);
            });
        }, 1000);
    }
});
