import { ts } from 'ts-morph';

enum TreeMode {
    forEachChild,
    getChildren
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
    // workaround for compiler api bug with getStart(sourceFile, true) (see PR #35029 in typescript repo)
    const jsDocs = ((node as any).jsDoc) as ts.Node[] | undefined;
    if (jsDocs && jsDocs.length > 0)
        return jsDocs[0].getStart(sourceFile);
    return node.getStart(sourceFile);
}

function getDescendantAtRange(
    mode: TreeMode,
    sourceFile: ts.SourceFile,
    range: [number, number]
): ts.Node {
    const getChildren = getChildrenFunction(mode, sourceFile);
    let bestMatch: { node: ts.Node; start: number; } = { node: sourceFile, start: sourceFile.getStart(sourceFile) };

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

export default function tsParser(code: string): void {
    const sourceFile = ts.createSourceFile('Example.ts', code, ts.ScriptTarget.Latest);
    console.log(getDescendantAtRange(TreeMode.forEachChild, sourceFile, [100, 100]));

    // console.log(sourceFile.getChildAtPos(1)?.getText());
    // sourceFile.transform(traversal => {
    //     const node = traversal.visitChildren();
    //     node.forEachChild(item => {
    //         if (SyntaxKind.Identifier === item.kind) {
    //             const lineAndColumn = sourceFile.getLineAndColumnAtPos(item.getStart());
    //         }
    //     });

    //     return node;
    // });
}