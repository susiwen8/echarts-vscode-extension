# echarts-vscode-extension
This is unofficial vscode extension for ECharts
## Install
* `ext install vscode-echarts-extension`
* Marketplace
## Command
This extension is automatically activate in JavaScript files
You can also activate by command line in vscode

List of commands

    Echarts
    ECharts autocomplete english version
    ECharts 自动补全中文版

PS: `Echarts` and `ECharts 自动补全中文版` will active chinese version.

## Problems
* All options information were received by ajax, useless when there were no Internet.
* Due to Apache server response speed, sometime connection timeout.
* Use closest node to determine CompletionItem which sometime is inaccurate.

## TODO
- [ ] Downgrade
- [ ] Optimization
- [ ] HoverProvider
