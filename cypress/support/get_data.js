Cypress.Commands.add('getData', city => {
    cy.get('#city').type(city);
    cy.contains('form button', 'Confirm').click();
});