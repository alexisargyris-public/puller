'use strict'

import Mygraphql from './mygraphql'

export default class Database {
  public gr: any

  constructor() {
    this.gr = new Mygraphql()
  }
  public listFiles() {
    let qr = `
    query {
      listFiles(first: 10) {
        items {
          fileId
          path
        }
      }
    }
    `
    return this.gr.query(qr).then(res => {
      let options: any[] = []

      res.data.listFiles.items.forEach(element => {
        options.push({ label: element.path, target: element.fileId })
      })
      return options
    })
  }
  public listSessionsByFile(fileId: String) {
    let qr = `
    query {
      listSessionsByFile(fileId: "${fileId}") {
        items {
          sessionId
        }
      }
    }
    `

    return this.gr.query(qr).then(res => {
      let options: any[] = []

      res.data.listSessionsByFile.items.forEach(element => {
        options.push({
          label: new Date(parseInt(element.sessionId, 10)).toLocaleString(),
          target: element.sessionId
        })
      })
      return options
    })
  }
  public listEventsBySession(sessionId: String) {
    let qr = `
    query {
      listEventsBySession(sessionId: "${sessionId}"){
        items {
          eventId
          content
          sessionId
        }
      }
    }
    `
    return this.gr.query(qr).then(res => {
      return res.data.listEventsBySession.items
    })
  }
}
