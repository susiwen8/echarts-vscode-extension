# echarts-vscode-extension
This is unofficial vscode extension for ECharts
[![](https://vsmarketplacebadge.apphb.com/version/susiwen8.vscode-echarts-extension.svg)](https://marketplace.visualstudio.com/items?itemName=susiwen8.vscode-echarts-extension) [![](https://vsmarketplacebadge.apphb.com/installs/susiwen8.vscode-echarts-extension.svg)](https://marketplace.visualstudio.com/items?itemName=susiwen8.vscode-echarts-extension)
## Install
* `ext install vscode-echarts-extension`
* Marketplace

## Example
![img](https://github.com/susiwen8/echarts-vscode-extension/blob/master/gif/example.gif)
## Command
This extension is automatically activate in JavaScript files

## Problems
* ~~All options information were received by ajax, useless when there were no Internet.~~ Cache response data
* ~~Due to Apache server response speed, sometime connection timeout.~~
* ~~Use closest node to determine CompletionItem which sometime is inaccurate.~~ Solution: Use [acorn](https://github.com/acornjs/acorn) to generate AST and find closest node by using [acorn-walk](https://github.com/acornjs/acorn/tree/master/acorn-walk)
* ~~Don't support completion when object inside object~~ Find out all ancestors option
* All options must be in one root object (There is nothing I can do about it, it has to be)

## TODO
- [x] Downgrade
- [x] Optimization
- [x] Object inside Object ex. title.textStyle
- [ ] add more option
- [x] base on option value type to provide helpful snippet text.
- [ ] Check if there were wrong or inappropriate value.
- [ ] HoverProvider
- [ ] More command
