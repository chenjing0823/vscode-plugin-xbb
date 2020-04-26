/*
 * @Author: jing.chen
 * @Date: 2020-04-16 11:24:27
 * @LastEditors: jing.chen
 * @LastEditTime: 2020-04-26 17:04:16
 * @Description: 
 */
const vscode = require('vscode');
const fs = require('fs');
let tips = '未知'
let selectTextBlock = 'uncheck'
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	var timeout = null;
	var activeEditor = vscode.window.activeTextEditor;
	console.log(activeEditor)

	vscode.window.onDidChangeTextEditorSelection(function (event) {
		//var aaa = activeEditor.document.getText(activeEditor.selection);
		//console.log("1onDidChangeTextEditorSelection:" + aaa);
		triggerUpdateDecorations();
	}, null, context.subscriptions);
	vscode.window.onDidChangeActiveTextEditor(function (editor) {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(function (event) {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	function triggerUpdateDecorations() {
		timeout && clearTimeout(timeout);
		timeout = setTimeout(updateDecorations, 1000);
	}

	function updateDecorations() {
		if (!activeEditor || !activeEditor.document) {
			return;
		}
		var text = activeEditor.document.getText();
		var wordSelect = activeEditor.document.getText(activeEditor.selection);
		const wordSelectArr = wordSelect.split('(\'')

		let word = '' // 翻译内容
		if (wordSelectArr[0].indexOf('$t') != -1) {
			word = wordSelectArr[1]
			selectTextBlock = wordSelectArr[1]
		} else {
			return false
		}

		console.log(word)
		const filePath = vscode.window.activeTextEditor.document.fileName // 当前文件名
		console.log(filePath)
		const fileDirRoot = filePath.split('src')[0] + 'src/lang/zh_CN' // 路径
		let fileDir = filePath.split('src')[0] + 'src/lang/zh_CN' // 路径
		var files = fs.readdirSync(fileDir) // 语言包路径下的文件

		// 处理语言包出处
		let key = '/src'
		let langPackage = ''
		if (filePath.indexOf('/src/components') != -1) {
			key = '/src/components'
			langPackage = 'components_' + filePath.split(key)[1].split('/')[1].split('/')[0] + '.js' // 所在语言包文件
			if (!files.includes(langPackage)) {
				langPackage = 'components_others.js'
			}
		} else if (filePath.indexOf('/src/views') != -1) {
			key = '/src/views'
			langPackage = 'views_' + filePath.split(key)[1].split('/')[1].split('/')[0] + '.js' // 所在语言包文件
			if (!files.includes(langPackage)) {
				langPackage = 'views_others.js'
			}
		}

		fileDir += '/' + langPackage

		// 读取语言包内容
		// let content = require(fileDir)
		let content = ''
		content = getTranslate(fileDir, word)

		// 可能在common里
		if (!content) {
			const path = fileDirRoot + '/common.js'
			content = getTranslate(path, word)
		}
		// 可能在others.js
		if (!content) {
			const path = fileDirRoot + '/others.js'
			content = getTranslate(path, word)
		}
		tips = content
		console.log('中文', content)
		// vscode.window.showInformationMessage(content)
		// return new vscode.Hover(word)
	}
	
	let disposable = vscode.commands.registerCommand('vscode-plugin-xbb.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from vscode-plugin-xbb!');
	});

	context.subscriptions.push(disposable);

	function getTranslate(fileDir, word) {
		let content = require(fileDir)
		let text = ''
		const keyWord = word.split('.') || []
		keyWord.forEach(item => {
			if (content[item]) {
				content = content[item] // 活动相对应的值
				text = content
			}
		})
		return text
	}
	function provideHover(document, position, token) {
		const hoverText = document.getText(document.getWordRangeAtPosition(position))
		if (tips && selectTextBlock.indexOf(hoverText) != -1) { // 只在选中这块显示
			return new vscode.Hover(`* ${tips}`);
		}
	}
	context.subscriptions.push(vscode.languages.registerHoverProvider(['vue', 'js'], {
		provideHover
	}))
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
