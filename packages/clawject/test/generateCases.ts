import { marked } from 'marked';
import fs from 'fs/promises';
import parse from 'node-html-parser';
import HTMLElement from 'node-html-parser/dist/nodes/html';
import * as path from 'path';
import glob from 'glob';
import { rimraf } from 'rimraf';

enum TAGS {
    FILE = 'H1',
    CASE = 'H2',
}

(async (): Promise<void> => {
    const generatedDir = path.join(__dirname, 'generated');
    await rimraf(generatedDir);
    await fs.mkdir(generatedDir);

    const casesPaths = await matchTestCases();

    await Promise.all(casesPaths.map(async filePath => {
        const baseName = path.basename(filePath, '.md');
        const fileContent = await fs.readFile(path.join(filePath), 'utf-8');
        const markdown = marked(fileContent);
        const html = parse(markdown);

        const childElements = html.childNodes.filter(it => it instanceof parse.HTMLElement) as HTMLElement[];

        let caseCode: string | null = null;
        const files: [path: string, content: string][] = [];

        for (let i = 0; i < childElements.length; i++) {
            const element = childElements[i];

            if (element.tagName === TAGS.FILE) {
                const filePath = element.textContent.trim();
                const parsedFileContent = parse(
                    childElements[i + 1].innerHTML
                ).childNodes[0].textContent;

                files.push([filePath, parsedFileContent]);

                i++;
                continue;
            }

            if (element.tagName === TAGS.CASE) {
                caseCode = parse(
                    childElements[i + 1].innerHTML
                ).childNodes[0].textContent;
                i++;
            }
        }

        if (caseCode === null) {
            throw new Error('Error parsing test case, caseName or caseCode is null');
        }

        const outDir = path.join(generatedDir, baseName);

        await fs.mkdir(outDir);

        await Promise.all([
            ...files.map(async ([filePath, content]) =>
                fs.writeFile(path.join(outDir, `${filePath}`), content)
            ),
            fs.writeFile(path.join(outDir, `${baseName}.test.ts`), caseCode),
        ]);
    }));
})();

function matchTestCases(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        glob(path.join(__dirname, 'cases/*.md'), (error, matches) => {
            if (error) {
                reject(error);
            }

            resolve(matches);
        });
    });
}

