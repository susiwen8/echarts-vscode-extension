import * as vscode from 'vscode';
import {
	generateAToZArray
} from './utils';
import {
	Node,
	isProperty,
	isIdentifier
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

	const completion: vscode.Disposable = vscode.languages.registerCompletionItemProvider(selector,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
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
					console.log(linePrefix)
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
		const text = event.document.getText();
		try {
			walk.ancestor(acorn.parse(text), {
				Property(node: Node, ancestors: Node[]) {
					const arr: string[] = [];
					if (node.type === 'Property') {
						ancestors.map(item => {
							if (isProperty(item) && isIdentifier(item.key) ) {
								arr.push(item.key.name);
							}
							if (item.type === 'Program') {
								arr.push('option');
							}
						})
						console.log(arr)
					}
				}
			});
		} catch (error) {
			console.log(error);
		}
    });

	context.subscriptions.push(completion);
}

// export function deactivate() {}
