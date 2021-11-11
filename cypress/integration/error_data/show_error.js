///<reference types="Cypress"/>

describe('Show error in case of incorrect data', () => {
    let random = length => Math.floor(Math.random() * length);
    before(() => cy.fixture('city_data').then(data => globalThis.data = data));
    beforeEach(() => cy.visit('/'));

    it('User uses non-english chars', () => {
        const city = data.incorrectData.nonEnglish[random(data.incorrectData.nonEnglish.length)];
        checkError(city);
        cy.makeRequestShowCity(city).then(resData => {
            expect(resData.message).equal('non-english chars');
            putCorrectData();
        });
    });

    it('User uses not chars', () => {
        const city = data.incorrectData.notChars[random(data.incorrectData.notChars.length)];
        checkError(city);
        cy.makeRequestShowCity(city).then(resData => {
            expect(resData.message).equal('non-english chars');
            putCorrectData();
        });
    });

    function checkError(city) {
        cy.getData(city);
        cy.get('.error-wrap').should('have.css', 'display', 'block');
    }

    function putCorrectData() {
        cy.get('#city').clear().type(data.city[0]);
        cy.contains('button', 'Confirm').click();
        cy.get('.error-wrap').should('not.have.css', 'display', 'block');
    }
})