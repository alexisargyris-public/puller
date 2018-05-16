'use strict'

import * as vscode from 'vscode'
import Database from './db'
import applyChange from './textEditor'
import * as sortby from 'lodash.sortby'

/**
 * This is called by vscode to activate the command contributed by the extension
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  // exit immediately if no document is open
  if (typeof vscode.window.activeTextEditor === 'undefined')
    // no editor is open
    // FIXME: return something that will allow successful activation after an editor is opened
    return

  console.log('puller activated')

  // status bar item
  let statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  )
  statusBarItem.text = 'puller'
  statusBarItem.show()

  const editor = vscode.window.activeTextEditor

  const db = new Database()

  let disposable = vscode.commands.registerCommand(
    'extension.puller',
    async () => {
      const getFiles = function() {
        return db.listFiles().then(res => {
          return sortby(res, [el => el.label])
        })
      }
      const getSessions = function(fileId) {
        return db.listSessionsByFile(fileId).then(res => {
          return sortby(res, [el => el.label])
        })
      }
      const getEvents = function(sessionId) {
        return db.listEventsBySession(sessionId).then(res => {
          return sortby(res, [el => el.eventId])
        })
      }
      // let things = await getFiles()
      const fileSelection = await vscode.window.showQuickPick(
        await getFiles(),
        {
          placeHolder: 'Select a file id.'
        }
      )
      const fileId = fileSelection.target
      const sessionSelection = await vscode.window.showQuickPick(
        await getSessions(fileId),
        {
          placeHolder: 'Select a session id.'
        }
      )
      const sessionId = sessionSelection.target
      const events = await getEvents(sessionId)
      for (let event of events) {
        let data = JSON.parse(event.content)
        let change = await applyChange(editor, data.range, data.text)
      }
    }
  )
  context.subscriptions.push(disposable)
}

/**
 * This is called by vscode when the extension needs to be deactivated
 */
export function deactivate() {}
