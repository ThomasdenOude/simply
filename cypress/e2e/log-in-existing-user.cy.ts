beforeEach(() => {
	cy.emailLogin(
		Cypress.env('testUserOne').email,
		Cypress.env('testUserOne').password
	);
});

it('should be logged in', () => {});
