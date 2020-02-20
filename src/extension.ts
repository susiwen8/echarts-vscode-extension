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

    let property = '';

    const completion = vscode.languages.registerCompletionItemProvider(selector,
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                if (property && optionsObj[property]) {
                    console.log(`provide: ${property}`)
                    return optionsObj[property];
                }

                if (!property) {
                    return;
                }

                let line = position.line;
                let linePrefix = document.lineAt(line).text;

                while (line >= 0 && (linePrefix = document.lineAt(line).text, linePrefix.indexOf('}') === -1)) {
                    linePrefix = linePrefix.replace(/[^a-zA-Z]/g,'');
                    if (optionsObj[linePrefix]) {
                        return optionsObj[linePrefix];
                    }

                    line -= 1;
                }
            }
        },
        ...generateAToZArray()
    );

    vscode.workspace.onDidChangeTextDocument(event => {
        const text = event.document.getText();
        const position = event.contentChanges[0].rangeOffset;
        try {
            const ast = acorn.parse(text)

            // input at 'Literal', which shouldn't give CompletionItem
            let node = walk.findNodeAround(ast, position, 'Literal');
            if (node) {
                property = '';
                return;
            }

            if (event.contentChanges[0].text.includes('\n')) {
                // input at 'Property', which should give CompletionItem
                node = walk.findNodeAround(ast, position, 'Property');
                if (node && isProperty(node.node)) {
                    property = node?.node?.key?.name;
                    console.log(property);
                }
            }
        } catch (error) {
            console.error('Parse error');
        }
    });

    context.subscriptions.push(completion);
}

// export function deactivate() {}
