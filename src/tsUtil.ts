import * as ts from 'typescript';
import {
    OptionsStruct
} from './type';
import Diagnostic from './diagnostic';
import {
    Range,
    DiagnosticSeverity,
    Position
} from 'vscode';

type BestMatch = {
    node: ts.Node;
    start: number;
}

function forEachChild(node: ts.Node): ts.Node[] {
    const nodes: ts.Node[] = [];
    node.forEachChild(child => {
        nodes.push(child);
    });
    return nodes;
}

function getStartSafe(node: ts.Node, sourceFile: ts.SourceFile): number {
    const jsDocs = ((node as any).jsDoc) as ts.Node[] | undefined;
    if (jsDocs && jsDocs.length > 0)
        return jsDocs[0].getStart(sourceFile);
    return node.getStart(sourceFile);
}

/* credit to David Sherret */
function getDescendantAtRange(
    sourceFile: ts.SourceFile,
    range: [number, number]
): ts.Node {
    let bestMatch: BestMatch = {
        node: sourceFile,
        start: sourceFile.getStart(sourceFile)
    };

    function isBeforeRange(pos: number): boolean {
        return pos < range[0];
    }

    function isAfterRange(nodeEnd: number): boolean {
        return nodeEnd >= range[0] && nodeEnd > range[1];
    }

    function searchDescendants(node: ts.Node): void {
        const children = forEachChild(node);
        for (const child of children) {
            if (child.kind !== ts.SyntaxKind.SyntaxList) {
                if (isBeforeRange(child.end))
                    continue;

                const childStart = getStartSafe(child, sourceFile);

                if (isAfterRange(childStart))
                    return;

                const isEndOfFileToken = child.kind === ts.SyntaxKind.EndOfFileToken;
                const hasSameStart = bestMatch.start === childStart && range[0] === childStart;
                if (!isEndOfFileToken && !hasSameStart)
                    bestMatch = { node: child, start: childStart };
            }

            searchDescendants(child);
        }
    }

    searchDescendants(sourceFile);
    return bestMatch.node;
}

function findChartTypeInTSObject(
    properties: ts.NodeArray<ts.ObjectLiteralElementLike>,
    sourceFile: ts.SourceFile
): string {
    for (let i = 0, len = properties.length; i < len; i++) {
        const propertie = properties[i] as ts.PropertyAssignment;
        if (propertie.name.getText(sourceFile) === 'type') {
            return propertie.initializer.getText(sourceFile).replace(/'/g, '');
        }
    }

    return '';
}

function findChartTypeInTS(
    node: ts.Node,
    position: number,
    sourceFile: ts.SourceFile
): string {
    if (node.kind === ts.SyntaxKind.PropertyAssignment) {
        node = (node as ts.PropertyAssignment).initializer;
    }
    if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
        const elements = (node as ts.ArrayLiteralExpression).elements;
        for (let i = 0, len = elements.length; i < len; i++) {
            if (position > elements[i].pos && position < elements[i].end) {
                return findChartTypeInTSObject((elements[i] as ts.ObjectLiteralExpression).properties, sourceFile);
            }
        }
    }

    if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        return findChartTypeInTSObject((node as ts.ObjectLiteralExpression).properties, sourceFile);
    }
    return '';
}

export default function walkTSNodeRecursive(
    sourceFile: ts.SourceFile,
    position: number,
    cursorPosition: number,
    optionChain: string
): string {
    const result = getDescendantAtRange(sourceFile, [position, position]);
    if (
        [
            ts.SyntaxKind.ObjectLiteralExpression,
            ts.SyntaxKind.ArrayLiteralExpression
        ].includes(result.kind)
    ) {
        const res = getDescendantAtRange(sourceFile, [result.pos - 1, result.pos - 1]);
        if (res.kind === ts.SyntaxKind.Identifier) {
            const identifier = res.getText(sourceFile);
            if (['series', 'visualMap', 'dataZoom'].includes(identifier)) {
                const chartType = findChartTypeInTS(result, cursorPosition, sourceFile);
                optionChain = `${identifier}${('.' + chartType)}${optionChain ? ('.' + optionChain) : ''}`;
            } else {
                optionChain = `${identifier}${optionChain ? '.' + optionChain : ''}`;
            }
        }

        return walkTSNodeRecursive(sourceFile, res.pos, cursorPosition, optionChain);
    } else if (
        ts.SyntaxKind.PropertyAssignment === result.kind
    ) {
        const name = (result as ts.PropertyAssignment).name.getText(sourceFile);
        const chartType = findChartTypeInTS(result, cursorPosition, sourceFile);
        return `${name}.${chartType}${optionChain ? ('.' + optionChain) : ''}`;
    } else if (
        [
            ts.SyntaxKind.NumericLiteral,
            ts.SyntaxKind.FalseKeyword,
            ts.SyntaxKind.TrueKeyword,
            ts.SyntaxKind.StringLiteral,
            ts.SyntaxKind.FunctionExpression
        ].includes(result.kind)
    ) {
        return '';
    }

    return optionChain;
}

function traverse(
    node: ts.Node,
    sourceFile: ts.SourceFile,
    optionsStruct: OptionsStruct,
    diagnostic: Diagnostic
): void {
    function traverseNode(node: ts.Node): void {
        switch (node.kind) {
            case ts.SyntaxKind.PropertyAssignment: {
                const name = (node as ts.PropertyAssignment).name as ts.Identifier;
                const initializer = (node as ts.PropertyAssignment).initializer as ts.ObjectLiteralExpression;
                const option = walkTSNodeRecursive(sourceFile, name.pos, name.pos, '');
                const key = `${option}${option ? '.' : ''}${name.text}`
                    .replace(/.rich.(\S*)/, '.rich.<style_name>');
                const legalOptions = optionsStruct[key];

                if (initializer.kind === ts.SyntaxKind.ObjectLiteralExpression && legalOptions) {
                    const valideOption = legalOptions.map(item => item.name);
                    initializer.properties.forEach(property => {
                        const name = ((property as ts.PropertyAssignment).name as ts.Identifier);
                        if (valideOption.indexOf(name.text) < 0) {
                            const position = ts.getLineAndCharacterOfPosition(sourceFile, name.getStart(sourceFile));
                            diagnostic.createDiagnostic(
                                new Range(
                                    new Position(position.line, position.character),
                                    new Position(position.line, position.character)
                                ),
                                `${name} doesn't exist`,
                                DiagnosticSeverity.Error
                            );
                        }
                    });
                }
                break;
            }

            default:
                break;
        }
        ts.forEachChild(node, traverseNode);
    }

    traverseNode(node);
    diagnostic.showError();

}

export function checkTsCode(
    diagnostic: Diagnostic,
    optionsStruct: OptionsStruct,
    sourceFile: ts.SourceFile
): void {
    traverse(sourceFile, sourceFile, optionsStruct, diagnostic);
}