import {
    languages,
    Diagnostic,
    Range,
    DiagnosticSeverity,
    Uri,
    Position
} from 'vscode';
import {
    OptionLoc,
    OptionsStruct,
    Property,
    COLOR_VALUE,
    isLiteral
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

    changeActiveEditor(uri: Uri): void {
        this.#uri = uri;
    }

    createDiagnostic(
        range: Range,
        message = 'warning',
        severity = DiagnosticSeverity.Warning
    ): void {
        this.#diagnostics.push(new Diagnostic(range, message, severity));
    }

    showError(): void {
        this.#diagnosticCollection.clear();
        this.#diagnosticCollection.set(this.#uri, this.#diagnostics);
    }

    checkOption(optionsLoc: OptionLoc, optionsStruct: OptionsStruct): void {
        for (const [key, value] of Object.entries(optionsLoc)) {
            if (!key || !value || !optionsStruct[key]) continue;
            const valideOption = optionsStruct[key].map(item => item.name);
            const optionsInCode = value.map(item => item.name);
            value.forEach(item => {
                const option = optionsStruct[key][valideOption.indexOf(item.name)];
                // Find those options which are not legal option
                if (valideOption.indexOf(item.name) < 0) {
                    this.createDiagnostic(
                        new Range(
                            new Position(item.loc.start.line - 1, item.loc.start.column),
                            new Position(item.loc.end.line - 1, item.loc.end.column)
                        ),
                        `${item.name} doesn't exist`,
                        DiagnosticSeverity.Error
                    );
                } else if (option.require) {// option requires another options
                    option.require.split(',').forEach((require, index) => {
                        // require option is not present
                        if (optionsInCode.indexOf(require) < 0) {
                            this.createDiagnostic(
                                new Range(
                                    new Position(item.loc.start.line - 1, item.loc.start.column),
                                    new Position(item.loc.end.line - 1, item.loc.end.column)
                                ),
                                `${item.name} requires ${require}`,
                                DiagnosticSeverity.Information
                            );
                        } else if (option.requireCondition) {
                            // require other option has specify value for this option
                            const requireValue = value[optionsInCode.indexOf(require)];
                            if (isLiteral(requireValue.value)) {
                                const requireConditionArr = option.requireCondition.split(',');
                                if (
                                    (
                                        requireConditionArr[index].indexOf('!==') > -1
                                        && requireConditionArr[index] === `!== ${requireValue.value.value}`
                                    )
                                    || (
                                        requireConditionArr[index].indexOf('!==') < 0
                                        && requireConditionArr[index] !== `${requireValue.value.value}`
                                    )
                                ) {
                                    this.createDiagnostic(
                                        new Range(
                                            new Position(requireValue.loc.start.line - 1, requireValue.loc.start.column),
                                            new Position(requireValue.loc.end.line - 1, requireValue.loc.end.column)
                                        ),
                                        `${item.name} requires ${require} value is ${requireConditionArr[index]}`,
                                        DiagnosticSeverity.Information
                                    );
                                }
                            }
                        }
                    });
                }
            });
        }
    }

    checkOptionValue(
        optionsStruct: OptionsStruct,
        option: string,
        node: Property,
        value: unknown
    ): void {
        for (let i = 0, len = optionsStruct[option].length; i < len; i++) {
            if (
                node.value.type === 'ArrayExpression'
                && optionsStruct[option][i].name === node.key.name
                && optionsStruct[option][i].type.includes('Array')) {
                continue;
            }

            if (
                optionsStruct[option][i].type.includes('number')
                && typeof value === 'number'
                && optionsStruct[option][i].range
                && (
                    value < optionsStruct[option][i].range[0]
                    || value > optionsStruct[option][i].range[1]
                )
            ) {
                this.createDiagnostic(
                    new Range(
                        new Position(node.value.loc.start.line - 1, node.value.loc.start.column),
                        new Position(node.value.loc.end.line - 1, node.value.loc.end.column)
                    ),
                    `${node.key.name} value is out of range, value should at ${optionsStruct[option][i].range}`
                );
            }

            if (optionsStruct[option][i].name === node.key.name
                && !optionsStruct[option][i].type.includes(typeof value)) {
                // Check color value
                if (
                    optionsStruct[option][i].type.includes('Color')
                    && typeof value === 'string'
                    && !(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value))
                    && !(/^rgb/.test(value))
                    && !(/^rgba/.test(value))
                    && !(COLOR_VALUE.includes(value))
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
                        || COLOR_VALUE.includes(value)
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