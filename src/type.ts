import * as acorn from 'acorn';
import * as ts from 'typescript';

export type Option = {
    name: string;
    type: string[];
    valide: (string | number)[];
    desc: string;
    range: number[];
    require?: string;
    requireCondition?: string;
};

export interface OptionsStruct {
    [key: string]: Option[];
}

export interface PropertyLoc {
    name: string;
    loc: acorn.SourceLocation;
    value: Literal | ObjectExpression | ArrayExpression;
}

export interface OptionLoc {
    [key: string]: PropertyLoc[] | undefined;
}

export interface OptionsNameItem {
    prop?: string;
    arrayItemType?: string;
    type?: string | string[];
    isObject?: boolean;
    default?: string | number | boolean;
    children?: OptionsNameItem[];
}

export type Node = acorn.Node;
export interface Property extends Node {
    type: 'Property';
    key: Identifier;
    value: Literal | ObjectExpression | ArrayExpression;
}
export interface Identifier extends Node {
    type: 'Identifier';
    name: string;
}

export interface ArrayExpression extends Node {
    type: 'ArrayExpression';
    elements: Node[];
    loc: acorn.SourceLocation;
}

export interface ObjectExpression extends Node {
    type: 'ObjectExpression';
    properties: Node[];
    loc: acorn.SourceLocation;
}

interface Literal extends Node {
    type: 'Literal';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    raw: string;
    loc: acorn.SourceLocation;
}

export function isProperty(node: Node): node is Property {
    return node.type === 'Property';
}

export function isIdentifier(node: Node): node is Identifier {
    return node.type === 'Identifier';
}

export function isLiteral(node: Node): node is Literal {
    return node.type === 'Literal';
}

export function isArrayExpression(node: Node): node is ArrayExpression {
    return node.type === 'ArrayExpression';
}

export function isObjectExpression(node: Node): node is ObjectExpression {
    return node.type === 'ObjectExpression';
}

export function isTsObjectExpression(node: ts.Node): node is ts.ObjectLiteralExpression {
    return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}

export function isTsProperty(node: ts.Node): node is ts.PropertyAssignment {
    return node.kind === ts.SyntaxKind.PropertyAssignment;
}

export function isTsArrayExpression(node: ts.Node): node is ts.ArrayLiteralExpression {
    return node.kind === ts.SyntaxKind.ArrayLiteralExpression;
}

export const COLOR_VALUE = [
    'transparent',
    'black',
    'silver',
    'gray',
    'white',
    'maroon',
    'red',
    'purple',
    'fuchsia',
    'green',
    'lime',
    'olive',
    'yellow',
    'navy',
    'blue',
    'teal',
    'aqua',
    'orange',
    'aliceblue',
    'antiquewhite',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'blanchedalmond',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgreen',
    'darkgrey',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
    'darkorchid',
    'darkred',
    'darksalmon',
    'darkseagreen',
    'darkslateblue',
    'darkslategray',
    'darkslategrey',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dimgrey',
    'dodgerblue',
    'firebrick',
    'floralwhite',
    'forestgreen',
    'gainsboro',
    'ghostwhite',
    'gold',
    'goldenrod',
    'greenyellow',
    'grey',
    'honeydew',
    'hotpink',
    'indianred',
    'indigo',
    'ivory',
    'khaki',
    'lavender',
    'lavenderblush',
    'lawngreen',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgreen',
    'lightgrey',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightslategrey',
    'lightsteelblue',
    'lightyellow',
    'limegreen',
    'linen',
    'mediumaquamarine',
    'mediumblue',
    'mediumorchid',
    'mediumpurple',
    'mediumseagreen',
    'mediumslateblue',
    'mediumspringgreen',
    'mediumturquoise',
    'mediumvioletred',
    'midnightblue',
    'mintcream',
    'mistyrose',
    'moccasin',
    'navajowhite',
    'oldlace',
    'olivedrab',
    'orangered',
    'orchid',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'pink',
    'plum',
    'powderblue',
    'rosybrown',
    'royalblue',
    'saddlebrown',
    'salmon',
    'sandybrown',
    'seagreen',
    'seashell',
    'sienna',
    'skyblue',
    'slateblue',
    'slategray',
    'slategrey',
    'snow',
    'springgreen',
    'steelblue',
    'tan',
    'thistle',
    'tomato',
    'turquoise',
    'violet',
    'wheat',
    'whitesmoke',
    'yellowgreen',
    'rebeccapurple'
];