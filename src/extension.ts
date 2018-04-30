'use strict'

import * as vscode from 'vscode'
import Config from './aws-exports'

/**
 * This is called by vscode to activate the command contributed by the extension
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  // exit immediately if no document is open
  if (typeof vscode.window.activeTextEditor === 'undefined') {
    // no editor is open
    // FIXME: return something that will allow successful activation after an editor is opened
    return
  }

  console.log('puller activated')

  // status bar item
  let statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  )
  statusBarItem.text = 'puller'
  statusBarItem.show()

  let disposable = vscode.commands.registerCommand('extension.puller', () => {})
  context.subscriptions.push(disposable)
}

/**
 * This is called by vscode when the extension needs to be deactivated
 */
export function deactivate() {}
