import {
    languages,
    Diagnostic,
    Range,
    DiagnosticSeverity,
    Uri,
    Position
} from 'vscode';
import difference from 'lodash/difference';
import flattenDeep from 'lodash/flattenDeep';
import {
    OptionLoc,
    OptionsStruct,
    Property
} from './type';

export default class EchartsDiagnostic {
    #diagnosticCollection = languages.createDiagnosticCollection('echarts');
    #diagnostics: Diagnostic[] = [];
    #uri: Uri;

    constructor(uri: Uri) {
        this.#uri = uri;
    }

    clearDiagnostics(): void {
        this.#diagnostics = [];
        this.#diagnosticCollection.clear();
    }

    createDiagnostic(range: Range, message = 'warning', severity = DiagnosticSeverity.Warning): void {
        this.#diagnostics.push(new Diagnostic(range, message, severity));
    }

    showError(): void {
        this.#diagnosticCollection.clear();
        this.#diagnosticCollection.set(this.#uri, this.#diagnostics);
    }

    //  TODO optimise
    checkOption(optionsLoc: OptionLoc, optionsStruct: OptionsStruct): void {
        for (const [key, value] of Object.entries(optionsLoc)) {
            if (!key || !value) continue;
            const valideOption = optionsStruct[key].map(item => item.name);
            const optionsInCode = flattenDeep(value.map(item => item.name));
            const diff = difference(optionsInCode, valideOption);
            for (let i = 0, diffLen = diff.length; i < diffLen; i++) {
                for (let j = 0, optionsInCodeLen = value.length; j < optionsInCodeLen; j++) {
                    if (value[j].name === diff[i]) {
                        this.createDiagnostic(
                            new Range(
                                new Position(value[j].loc.start.line - 1, value[j].loc.start.column),
                                new Position(value[j].loc.end.line - 1, value[j].loc.end.column)
                            ),
                            'Wrong option',
                            DiagnosticSeverity.Error
                        );
                        break;
                    }
                }
            }
        }
    }

    checkOptionValue(optionsStruct: OptionsStruct, option: string, node: Property, value: unknown): void {
        for (let i = 0, len = optionsStruct[option].length; i < len; i++) {
            if (optionsStruct[option][i].name === node.key.name
                && !optionsStruct[option][i].type.includes(typeof value)) {
                // Check color value
                if (
                    optionsStruct[option][i].type.includes('Color')
                    && typeof value === 'string'
                    && !(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value))
                    && !(/^rgb/.test(value))
                    && !(/^rgba/.test(value))
                ) {
                    this.createDiagnostic(
                        new Range(
                            new Position(node.value.loc.start.line - 1, node.value.loc.start.column),
                            new Position(node.value.loc.end.line - 1, node.value.loc.end.column)
                        ),
                        `wrong value for ${node.key.name}`
                    );
                } else if (
                    optionsStruct[option][i].type.includes('Color')
                    && typeof value === 'string'
                    && (
                        /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value)
                        || /^rgb/.test(value)
                        || /^rgba/.test(value)
                    )
                ) {
                    continue;
                }

                this.createDiagnostic(
                    new Range(
                        new Position(node.value.loc.start.line - 1, node.value.loc.start.column),
                        new Position(node.value.loc.end.line - 1, node.value.loc.end.column)
                    ),
                    `wrong type for ${node.key.name}, valide type are ${optionsStruct[option][i].type.join(',')}`
                );

            }
        }
    }
}