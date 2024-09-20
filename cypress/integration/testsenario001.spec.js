// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

/**
 * Adds command "cy.waitForResource(name)" that checks performance entries
 * for resource that ends with the given name.
 * This command only applies to the tests in this spec file
 *
 * @see https://developers.google.com/web/tools/chrome-devtools/network/understanding-resource-timing
 */
Cypress.Commands.add('waitForResource', (name, options = {}) => {
    if (Cypress.browser.family === 'firefox') {
      cy.log('Skip waitForResource in Firefox')

      return
    }

    cy.log(`Waiting for resource ${name}`)

    const log = false // let's not log inner commands
    const timeout = options.timeout || Cypress.config('defaultCommandTimeout')

    cy.window({ log }).then(
      // note that ".then" method has options first, callback second
      // https://on.cypress.io/then
      { log, timeout },
      (win) => {
        return new Cypress.Promise((resolve, reject) => {
          let foundResource

          // control how long we should try finding the resource
          // and if it is still not found. An explicit "reject"
          // allows us to show nice informative message
          setTimeout(() => {
            if (foundResource) {
              // nothing needs to be done, successfully found the resource
              return
            }

            clearInterval(interval)
            reject(new Error(`Timed out waiting for resource ${name}`))
          }, timeout)

          const interval = setInterval(() => {
            foundResource = win.performance
            .getEntriesByType('resource')
            .find((item) => item.name.endsWith(name))

            if (!foundResource) {
              // resource not found, will try again
              return
            }

            clearInterval(interval)
            // because cy.log changes the subject, let's resolve the returned promise
            // with log + returned actual result
            resolve(
              cy.log('✅ success').then(() => {
                // let's resolve with the found performance object
                // to allow tests to inspect it
                return foundResource
              })
            )
          }, 100)
        })
      }
    )
  })



describe('テスト大項目01', () => {
    context('テスト中項目01', () =>{
        it('テスト小項目01:ページを開く', () => {
            cy.viewport(1440, 798);
            // top indexにアクセスする
            cy.visit('http://localhost:3333');
        })

        it('テスト小項目02:指定idの要素があるか', () => {
            // https://docs.cypress.io/api/commands/get
            // id要素が存在するか
            cy.get('#title').should('exist');
        })
        it('テスト小項目03:指定id titleの内容が「福岡市の魅力」なのか', () => {
            // https://docs.cypress.io/api/commands/get
            // id要素が存在するか
            cy.get('#title').should('have.text','福岡市の魅力');
        })
        const timeout = 1500 // ms
        it('テスト小項目04:/css/index.cssファイルが存在するか', () => {
            // waitForResource defined at
            // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__wait-for-resource/cypress/e2e/spec.cy.js
            cy.waitForResource('/css/index.css')
        })

        it('テスト小項目05:（index.cssにて）h1タグの色指定が「rgb(255, 105, 180)」なのか', () => {
          cy.get('h1', { timeout }).should('have.css', 'color', 'rgb(255, 105, 180)')
        })
    })
})
