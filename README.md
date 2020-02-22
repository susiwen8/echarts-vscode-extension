# echarts-vscode-extension
This is unofficial vscode extension for ECharts
## Install
* `ext install vscode-echarts-extension`
* Marketplace

## Example
![img](https://github.com/susiwen8/echarts-vscode-extension/blob/master/gif/example.gif)
## Command
This extension is automatically activate in JavaScript files
You can also activate by command line in vscode

List of commands

    Echarts

PS: `Echarts` now support chinese version. (Will support english version in future)

## Problems
* ~~All options information were received by ajax, useless when there were no Internet.~~
* ~~Due to Apache server response speed, sometime connection timeout.~~
* ~~Use closest node to determine CompletionItem which sometime is inaccurate.~~ Solution: Use [acorn](https://github.com/acornjs/acorn) to generate AST and find closest node by using [acorn-walk](https://github.com/acornjs/acorn/tree/master/acorn-walk)
* Don't support completion when object inside object

## TODO
- [x] Downgrade
- [x] Optimization
- [ ] Object inside Object ex. title.textStyle
- [ ] Check if there were wrong or inappropriate value.
- [ ] Support english
- [ ] HoverProvider
