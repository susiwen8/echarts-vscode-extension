import * as vscode from 'vscode';
import {
    generateAToZArray
} from './utils';
import {
    isProperty,
    isLiteral,
    CHART_TYPE
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

    let option = '';

    const completion = vscode.languages.registerCompletionItemProvider(selector,
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                if (option && optionsObj[option]) {
                    console.log(`provide: ${option}`)
                    return optionsObj[option];
                }

                if (!option) {
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
        try {
            const text = event.document.getText();
            const position = event.contentChanges[0].rangeOffset;
            const ast = acorn.parse(text)
            const literal = walk.findNodeAround(ast, position, 'Literal');
            const property = walk.findNodeAround(ast, position, 'Property');

            // Literal value is one of chart types and Property is type
            // Then we know right now input is in series option
            if (literal && isLiteral(literal.node)
                && CHART_TYPE.includes(literal.node.value)
                && property && isProperty(property.node)
                && property.node.key.name === 'type') {
                console.log(`type: ${literal.node.value}`);
                option = `type${literal.node.value}`;
                return;
            }

            // input is in Literal, then don't show completion
            if (literal && isLiteral(literal.node)) {
                option = '';
                return;
            }

            // Hit enter and input is in series
            if (event.contentChanges[0].text.includes('\n')
                && property && isProperty(property.node)
                && property.node.key.name === 'series') {
                // input at 'Property', which should give CompletionItem
                option = property?.node?.key?.name;
                console.log(`in: ${option}`);
                return;
            }

            // Hit enter and input is not in series
            if (event.contentChanges[0].text.includes('\n')
                && property && isProperty(property.node)
                && property.node.key.name !== 'series') {
                // input at 'Property', which should give CompletionItem
                option = property?.node?.key?.name;
                console.log(`out: ${option}`);
                return;
            }

        } catch (error) {
            // In the case of parse error
            // downgrade to use position line
            option = 'error';
            console.error('Parse error');
        }
    });

    context.subscriptions.push(completion);
}

// export function deactivate() {}
