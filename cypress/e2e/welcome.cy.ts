describe('Welcome', () => {
	beforeEach(() => {
		cy.visit('http://localhost:4200');
	});

	context('Header', () => {
		it('has the "Simply" logo', () => {
			cy.getByData('header-logo').should('contain', 'Simply');
		});

		it('has log in button that links to login page', () => {
			cy.getByData('header-log-in')
				.should('exist')
				.click()
				.location('pathname')
				.should('equal', '/account/log-in');
		});
	});

	context('Welcome message', () => {
		it('has the welcome title', () => {
			cy.getByData('welcome-title').should('contain', 'Simply');
		});

		it('has a sign up button that links to sign up page', () => {
			cy.getByData('welcome-sign-up')
				.click()
				.location('pathname')
				.should('equal', '/account/sign-up');
		});
	});
});
