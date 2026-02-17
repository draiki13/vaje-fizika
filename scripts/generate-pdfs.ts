import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';
import { generateLatex } from '../src/lib/latex-generator';

const execPromise = util.promisify(exec);

// Recursive function to find all MDX files
function getMdxFiles(dir: string, fileList: string[] = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getMdxFiles(filePath, fileList);
        } else {
            if (file.endsWith('.mdx')) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

async function generateAllPdfs() {
    const contentDir = path.join(process.cwd(), 'content');
    const publicPdfDir = path.join(process.cwd(), 'public', 'pdfs');

    // Ensure public/pdfs exists
    if (!fs.existsSync(publicPdfDir)) {
        fs.mkdirSync(publicPdfDir, { recursive: true });
    }

    const files = getMdxFiles(contentDir);
    console.log(`Found ${files.length} MDX files.`);

    for (const filePath of files) {
        // Convert file path to slug array
        // e.g. content/1-letnik/kinematika/file.mdx -> ['1-letnik', 'kinematika', 'file']
        const relativePath = path.relative(contentDir, filePath);
        const slug = relativePath.replace('.mdx', '').split(path.sep);
        const filename = slug[slug.length - 1];

        console.log(`Generating PDF for: ${filename}...`);

        try {
            // 1. Generate LaTeX
            const latexCode = await generateLatex(slug);

            // 2. Compile with pdflatex
            const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vaje-fizika-'));
            const texFilePath = path.join(tempDir, 'output.tex');
            const pdfFilePath = path.join(tempDir, 'output.pdf');

            fs.writeFileSync(texFilePath, latexCode);

            // Use absolute path since PATH might not be updated yet
            const pdflatexPath = String.raw`C:\Users\Luka\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe`;

            await execPromise(`"${pdflatexPath}" -interaction=nonstopmode -output-directory="${tempDir}" "${texFilePath}"`);

            // 3. Move PDF to public folder
            const destPath = path.join(publicPdfDir, `${filename}.pdf`);
            fs.copyFileSync(pdfFilePath, destPath);

            console.log(`✅ Saved to public/pdfs/${filename}.pdf`);

            // Cleanup
            // fs.rmSync(tempDir, { recursive: true, force: true });

        } catch (error) {
            console.error(`❌ Failed to generate ${filename}:`, error);
        }
    }
}

generateAllPdfs();
