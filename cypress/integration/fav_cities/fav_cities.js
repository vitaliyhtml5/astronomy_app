///<reference types="Cypress"/>

describe('User uses Favorite cities menu', () => {
    before(() => cy.fixture('city_data').then(data => globalThis.data = data));
    beforeEach(() => {
        cy.visit('/');
        cy.viewport(1200, 780);
        cy.clearLocalStorage();
    });

    it('User adds one new city', () => {
        const city = getRandomCity();
        cy.intercept('GET', `http://127.0.0.1:3000/get_data?city=${city}`).as('getRes');
        cy.getData(city);

        cy.wait('@getRes').then(() => {
            cy.wait(1000);
            cy.get('.add-fav').click({force:true});
            cy.get('.fav-main').should('have.css', 'display', 'block');
            cy.get('.content h2').then(cityName => {
                cy.get('.fav-city__block span').should('have.text', cityName.text());
                expect(localStorage.getItem('favCity')).include(cityName.text());
            });
        });
    });

    it('User adds 2 new cities', () => {
        const city = getRandomCityArr();
        cy.intercept('GET', `http://127.0.0.1:3000/get_data?city=${city[0]}`).as('getResFirst');
        cy.intercept('GET', `http://127.0.0.1:3000/get_data?city=${city[1]}`).as('getResSecond');

        cy.getData(city[0]);
        cy.wait('@getResFirst').then(() => cy.get('.add-fav').click({force:true}));
        cy.get('#city').clear();
        cy.getData(city[1]);
        cy.wait('@getResSecond').then(() => {
            cy.get('.add-fav').click({force:true})
            cy.get('.fav-city__block').should('have.length', 2);
        });
    });

    it('User loads data from Favorite city menu', () => {
        const city = getRandomCity();
        setStorage(city);
        cy.intercept('GET', `http://127.0.0.1:3000/get_data?city=${city}`).as('getRes');

        cy.get('.fav-city__block span').click({force:true});
        cy.wait('@getRes').then(() => {
            cy.get('.content h2').then(cityName => expect(cityName.text()).equal(city));
        });
    });

    it('User deletes one favorite city', () => {
        setStorage(`${data.city[0]},${data.city[1]}`);
        cy.get('.fav-city__block button').eq(0).click().then(() => expect(localStorage.getItem('favCity')).equal(data.city[1]));
        cy.get('.fav-city__block').should('have.length', 1);
        cy.reload();
        cy.get('.fav-city__block').should('have.length', 1);
    });

    it('User deletes all favorite cities', () => {
        setStorage(getRandomCity());
        cy.get('.fav-city__block button').click().then(() => {
            cy.get('.fav-city__block').should('not.exist')
            expect(localStorage.getItem('favCity')).not.exist;
            cy.get('.fav-main').should('have.css', 'display', 'none');
            cy.reload();
            cy.get('.fav-main').should('have.css', 'display', 'none');
        });
    });

    //Negative tests
    it('[Negative] User tries to add already exist city', () => {
        const city = getRandomCity();
        setStorage(city);
        cy.intercept('GET', `http://127.0.0.1:3000/get_data?city=${city}`).as('getRes');

        cy.getData(city);
        cy.wait('@getRes').then(() => {
            cy.get('.add-fav').click({force:true});
            cy.get('.fav-city__block').should('have.length', 1);
            cy.reload();
            cy.get('.fav-city__block').should('have.length', 1);
        });
    });

    function getRandomCity() {
        return data.city[Math.floor(Math.random() * data.city.length)];
    }
    function getRandomCityArr() {
        let arr = [getRandomCity()];
        getUniqueCity();
        
        function getUniqueCity() {
            let city = getRandomCity();
            if (city === getRandomCity()) {
                getUniqueCity();
            } else {
                arr.push(city);
            }
        }
        return arr;
    }
    function setStorage(city) {
        localStorage.setItem('favCity', city);
        cy.reload();
    }
});