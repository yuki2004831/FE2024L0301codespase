// CypressによるE2Eテストが実施される前に読み込まれるファイル
import addContext from 'mochawesome/addContext'

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    addContext(
      { test },
      `./screenshots/${location.pathname.replace(/(.*)\//, '')}/${runnable.parent.title} -- ${
        test.title
      } (failed).png`
    )
  }
  addContext({ test }, `./videos/${location.pathname.replace(/(.*)\//, '')}.mp4`)
})

