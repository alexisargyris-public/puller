'use strict'
import * as vscode from 'vscode'

function getDocument(vsEditor: any) {
  return typeof vsEditor._documentData !== 'undefined'
    ? vsEditor._documentData
    : vsEditor._document
}
function positionFactory(line: number, char: number) {
  return new vscode.Position(line, char)
}
function rangeFactory(start: any, end: any) {
  // positions
  return new vscode.Range(start, end)
}
function textEditFactory(range: any, content: string) {
  // range
  return new vscode.TextEdit(range, content)
}
function editFactory(coords: any, content: string) {
  var start = positionFactory(coords[0].line, coords[0].character)
  var end = positionFactory(coords[1].line, coords[1].character)
  var range = rangeFactory(start, end)

  return textEditFactory(range, content)
}
function workspaceEditFactory() {
  return new vscode.WorkspaceEdit()
}
function setEditFactory(uri: any, coords: any, content: string) {
  var workspaceEdit = workspaceEditFactory()
  var edit = editFactory(coords, content)

  workspaceEdit.set(uri, [edit])
  return workspaceEdit
}
export default function applyChange(
  vsEditor: any,
  coords: any,
  content: string
) {
  var vsDocument = getDocument(vsEditor)
  var edit = setEditFactory(vsDocument._uri, coords, content)
  return vscode.workspace.applyEdit(edit)
}
