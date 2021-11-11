///<reference types="Cypress"/>

describe('User gets astronomy data', () => {
    let random = length => Math.floor(Math.random() * length);
    before(() => cy.fixture('city_data').then(data => globalThis.data = data));
    beforeEach(() => {
        cy.visit('/');
        cy.clearLocalStorage();
    });

    it('User gets solar data successfuly', () => {
        const city = data.city[random(data.city.length)];
        cy.intercept(`http://127.0.0.1:3000/get_data?city=${city}`).as('getRes');

        cy.get('#city').type(city).should('have.value', city);
        cy.contains('form button', 'Confirm').click();
        cy.wait('@getRes').then(resData => {
            const data = [resData.response.body.city, resData.response.body.time, resData.response.body.sunrise, resData.response.body.sunset, resData.response.body.solarNoon];
            cy.get('.content h2').should('have.text', data[0]);
            cy.get('.content-data td').eq(0).should('have.text', data[1]);
            cy.get('.content-data td').eq(1).should('have.text', data[2]);
            cy.get('.content-data td').eq(2).should('have.text', data[3]);
        });
    });

    it('User changes solar and moon data successfully', () => {
        const city = data.city[random(data.city.length)];
        cy.intercept(`http://127.0.0.1:3000/get_data?city=${city}`).as('getRes');
        cy.get('.toggle button').as('toggle');

        cy.getData(city);
        cy.wait('@getRes').then(resData => {
            const sunData = [resData.response.body.sunrise, resData.response.body.sunset, resData.response.body.solarNoon];
            const moonData = [resData.response.body.moonrise, resData.response.body.moonset, resData.response.body.moonDistance];
            cy.get('@toggle').should('have.class', 'toggle-left').click();
            cy.get('.content-data td').eq(1).should('have.text', moonData[0]);
            cy.get('.content-data td').eq(2).should('have.text', moonData[1]);
            cy.get('.content-data td').eq(3).should('have.text', moonData[2]);

            cy.get('@toggle').should('have.class', 'toggle-right').click();
            cy.get('.content-data td').eq(1).should('have.text', sunData[0]);
            cy.get('.content-data td').eq(2).should('have.text', sunData[1]);
            cy.get('.content-data td').eq(3).should('have.text', sunData[2]);

        });
    });

    it('User gets data of the 2nd city successfully', () => {
        cy.intercept(`http://127.0.0.1:3000/get_data?city=${data.city[1]}`).as('getResFirst');
        cy.intercept(`http://127.0.0.1:3000/get_data?city=${data.city[2]}`).as('getResSecond');
        cy.get('.toggle button').as('toggle');

        cy.getData(data.city[1]);
        cy.wait('@getResFirst').then(() => {
            cy.get('#city').clear();
            cy.get('@toggle').click();
        });
        cy.getData(data.city[2]);
        cy.wait('@getResSecond').then(() => {
            cy.get('@toggle').should('have.class', 'toggle-left');
            cy.get('.content h2').should('have.text', data.city[2]);
        });
    });

    it('User gets different day-time', () => {
        const city = data.city[random(data.city.length)];
        cy.intercept(`http://127.0.0.1:3000/get_data?city=${city}`).as('getRes');

        cy.getData(city);
        cy.wait('@getRes').then(resData => {
            if (resData.response.body.dayTime === 'night') {
                cy.get('.content').should('have.class','content_night');
                cy.get('.object-way img').invoke('attr', 'src').should('include', 'moon.svg');
            } else if (resData.response.body.dayTime === 'day' || resData.response.body.dayTime === 'twilight') {
                cy.get('.content').should('not.have.class','content_night');
                cy.get('.object-way img').invoke('attr', 'src').should('include', 'sun.svg');
            }
        }); 
    });

    it('User gets data if Favorite city is set', () => {
        const city = data.city[random(data.city.length)];
        localStorage.setItem('favCity', city);
        cy.intercept(`http://127.0.0.1:3000/get_data?city=${city}`).as('getRes');
        cy.reload();
        cy.get('h2').should('have.text', city);
    });

    it('User navigates to Weather app successfully', () => {
        cy.contains('a', 'Weather application').click();
        cy.url().should('include', 'weather-app');
    });
});