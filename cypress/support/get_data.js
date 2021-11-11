Cypress.Commands.add('getData', city => {
    cy.get('#city').type(city);
    cy.contains('form button', 'Confirm').click();
});

Cypress.Commands.add('makeRequestShowCity', city => {
    cy.request({
        method: 'GET',
        failOnStatusCode: false,
        url: `http://127.0.0.1:3000/get_data?city=${city}`
    }).then(res => res.body);
});