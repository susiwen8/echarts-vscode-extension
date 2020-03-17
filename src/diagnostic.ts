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
    OptionsStruct
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
}