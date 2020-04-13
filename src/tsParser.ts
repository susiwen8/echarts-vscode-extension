import * as ts from 'typescript';
import { TreeMode } from './type';

type BestMatch = {
    node: ts.Node;
    start: number;
}

function getChildrenFunction(
    mode: TreeMode,
    sourceFile: ts.SourceFile
): (node: ts.Node) => ts.Node[] {
    function getAllChildren(node: ts.Node): ts.Node[] {
        return node.getChildren(sourceFile);
    }

    function forEachChild(node: ts.Node): ts.Node[] {
        const nodes: ts.Node[] = [];
        node.forEachChild(child => {
            nodes.push(child);
            return undefined;
        });
        return nodes;
    }

    switch (mode) {
        case TreeMode.getChildren:
            return getAllChildren;

        case TreeMode.forEachChild:
        default:
            return forEachChild;
    }

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
    range: [number, number],
    mode: TreeMode = TreeMode.forEachChild
): ts.Node {
    const getChildren = getChildrenFunction(mode, sourceFile);
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
        const children = getChildren(node);
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

function walkTSNodeRecursive(
    sourceFile: ts.SourceFile,
    position: number,
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
            optionChain = `${res.getText(sourceFile)}${optionChain ? '.' + optionChain : ''}`;
        }

        return walkTSNodeRecursive(sourceFile, res.pos, optionChain);
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

/**
 * Base on cursor position to get option chaine
 * @param code TypeScript code string
 * @param position cursor position
 */
export default function tsParser(code: string, position: number): string {
    const sourceFile = ts.createSourceFile('Example.ts', code, ts.ScriptTarget.Latest);
    const option = walkTSNodeRecursive(sourceFile, position, '');
    return option.replace(/.rich.(\S*)/, '.rich.<style_name>');
}