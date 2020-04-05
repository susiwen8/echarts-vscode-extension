# echarts-vscode-extension

![logo](https://github.com/susiwen8/echarts-vscode-extension/blob/master/images/logo.png)

This is unofficial vscode extension for ECharts

## Install
* `ext install vscode-echarts-extension`
* Marketplace [![](https://vsmarketplacebadge.apphb.com/version/susiwen8.vscode-echarts-extension.svg)](https://marketplace.visualstudio.com/items?itemName=susiwen8.vscode-echarts-extension) [![](https://vsmarketplacebadge.apphb.com/installs/susiwen8.vscode-echarts-extension.svg)](https://marketplace.visualstudio.com/items?itemName=susiwen8.vscode-echarts-extension)

## Commands

This extension provides 3 commands

* `echarts.activate`: extension provides completion when matched case occur
* `echarts.deactivate`: extension never show completion
* `echarts.reload`: re-request api when request api failure

PS: From 0.1.2, extension won't provide completion at first, because JS file may not contain ECharts. User need to execute `echarts.activate` at command panel.

## Example
![example](https://github.com/susiwen8/echarts-vscode-extension/blob/master/gif/example.gif)

## Problems
* ~~All options information were received by ajax, useless when there were no Internet.~~ Cache response data (<font color="red">Update: json file store at local</font>)
* ~~Due to Apache server response speed, sometime connection timeout.~~(<font color="red">Trying Netlify, but JSON files are so big and may have other known issues</font>)
* ~~Use closest node to determine CompletionItem which sometime is inaccurate.~~ Solution: Use [acorn](https://github.com/acornjs/acorn) to generate AST and find closest node by using [acorn-walk](https://github.com/acornjs/acorn/tree/master/acorn-walk)
* ~~Don't support completion when object inside object~~ Find out all ancestors option
* All options must be in one root object (There is nothing I can do about it, it has to be :man_shrugging:)

## Suggestion
For the purpose of functionnality, I strongly recommend that putting ECharts option object at seperated js file, and put options in same object.
(Actually, this will reduce losts of work, make my life much easy :stuck_out_tongue_winking_eye:)

## Documentation
Documentation generate from [here](https://github.com/susiwen8/incubator-echarts-doc/tree/api).

## TODO
- [x] Downgrade
- [x] Optimization
- [x] Object inside Object ex. title.textStyle
- [ ] Replace Apache api (WIP, trying Netlify and reduce json file size)
- [x] base on option value type to provide helpful snippet text.
- [x] Check if type of value were correct.
- [x] Provide english documentation
- [ ] Provide chinese documentation
- [x] Convert HTML to Markdown (documentation)
- [x] Check if value were resonable.
- [ ] HoverProvider
- [x] More command
