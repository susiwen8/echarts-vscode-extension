import * as vscode from 'vscode';
import {
    generateAToZArray
} from './utils';
import {
    isProperty
} from './type';
import getAllOptions from './options/index';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const optionsObj = await getAllOptions();

    const selector: vscode.DocumentSelector = {
        scheme: 'file',
        language: 'javascript'
    };

    let prevLine = -1;
    let prevOption: vscode.CompletionItem[];
    let property = '';

    const completion = vscode.languages.registerCompletionItemProvider(selector,
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                if (property && optionsObj[property]) {
                    console.log(`provide: ${property}`)
                    prevOption = optionsObj[property];
                    return prevOption;
                }

                let line = position.line;
                let linePrefix = document.lineAt(line).text;

                // Optimization
                // TODO: update return option by block not line
                if (line === prevLine) {
                    return prevOption;
                }
                prevLine = line;

                while (line >= 0 && (linePrefix = document.lineAt(line).text, linePrefix.indexOf('}') === -1)) {
                    linePrefix = linePrefix.replace(/[^a-zA-Z]/g,'');
                    if (optionsObj[linePrefix]) {
                        prevOption = optionsObj[linePrefix];
                        return prevOption;
                    }

                    line -= 1;
                }
            }
        },
        ...generateAToZArray()
    );

    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.contentChanges[0].text.includes('\n')) {
            const text = event.document.getText();
            const position = event.contentChanges[0].rangeOffset;
            try {
                const node = walk.findNodeAround(acorn.parse(text), position, 'Property');
                if (node && isProperty(node.node)) {
                    property = node?.node?.key?.name;
                    console.log(property);
                }
            } catch (error) {
                console.log(error);
            }
        }

    });

    context.subscriptions.push(completion);
}

// export function deactivate() {}
