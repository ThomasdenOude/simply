/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
	interface Chainable<Subject> {
		getByData(
			dataTestAttribute: string,
			args?: any
		): Chainable<JQuery<HTMLElement>>;
		emailLogin(email: string, password: string): void;
	}
}

Cypress.Commands.add('getByData', (dataTestAttribute: string, ...args: any) => {
	return cy.get(`[data-test=${dataTestAttribute}]`, ...args);
});

Cypress.Commands.add('emailLogin', (email: string, password: string): void => {
	cy.visit('/');

	cy.location('pathname').then(path => {
		if (path !== '/') {
			cy.log('Already logged in');
		} else {
			cy.getByData('header-log-in').should('exist').click();

			cy.location('pathname').should('equal', '/account/log-in');

			cy.getByData('email-input').type(email, { log: false });
			cy.getByData('password-input').type(password, { log: false });
			cy.getByData('submit-button').click();
		}
	});
});
