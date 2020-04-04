import { Project, SyntaxKind } from 'ts-morph';

export default function tsParser(code: string): void {
    const project = new Project();
    const sourceFile = project.createSourceFile('Example.ts', code);

    console.log(sourceFile.getChildAtPos(1)?.getText());
    sourceFile.transform(traversal => {
        const node = traversal.visitChildren();
        node.forEachChild(item => {
            if (SyntaxKind.Identifier === item.kind) {
                const lineAndColumn = sourceFile.getLineAndColumnAtPos(item.getStart());
            }
        });

        return node;
    });
}