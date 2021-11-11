'use strict';

const city = document.querySelector('h2');
const content = document.querySelectorAll('.content-data tr>*');
const imgObject = document.querySelector('.object-way>img');
const formMain = document.querySelector('form');
const errWrap = document.querySelector('.error-wrap');
const loader = document.querySelector('.loader');
getFavCities();


formMain.addEventListener('submit', (e) => {
    const inputCity = document.querySelector('input');
    e.preventDefault();

    if (inputCity.value !== '') {
        errWrap.style.display = 'none';
        getData(inputCity.value);
    } else {
        showError('Please type your location', 'img/400.png');
    }
});

if (localStorage.getItem('favCity') !== null) {
    const cityStorage = localStorage.getItem('favCity').split(',');
    getData(cityStorage[0]);
} else {
    getData('Dnipro');
}

async function getData(cityValue) {
    loader.style.display = 'block';
    const res = await fetch(`/get_data?city=${cityValue}`);
    const data = await res.json();
    loader.style.display = 'none';

    if (data.message === 'non-english chars') {
        showError('Only English chars can be put', 'img/400.png');
    } else if (data.code === 500) {
        showError(data.message, 'img/500.png');
    } else {
        fillData(data);
        showImage(data);
    }
}

function fillData(data) {
    const headerData = document.querySelectorAll('.content-data th');
    const contentData = document.querySelectorAll('.content-data td');
    const sunArr = ['Local time: ','Sunrise: ','Sunset: ','Solar noon: '];
    const sunValArr = [data.time, data.sunrise, data.sunset, data.solarNoon];
    const moonArr = ['Local time: ','Moonrise: ','Moonset: ','Distance: '];
    const moonValArr = [data.time, data.moonrise, data.moonset, data.moonDistance];
    const toggle = document.querySelector('.toggle button');
    const title = document.querySelectorAll('.toggle b');
    
    changeBackground(data.dayTime);
    changeData(sunArr, sunValArr);
    moveToggleDefault();
        
    toggle.onclick = () => {
        if (toggle.classList.contains('toggle-left')) {
            toggle.classList.remove('toggle-left');
            toggle.classList.add('toggle-right');
            title[0].style.textDecoration = 'none';
            title[1].style.textDecoration = 'underline';
            changeData(moonArr, moonValArr);
        } else {
            moveToggleDefault();
        }
    }

    function moveToggleDefault() {
        toggle.classList.remove('toggle-right');
        toggle.classList.add('toggle-left');
        title[1].style.textDecoration = 'none';
        title[0].style.textDecoration = 'underline';
        changeData(sunArr, sunValArr);
    }

    function changeData(dataHeader, valArr) {
        city.textContent = data.city;
        headerData.forEach((el,index) => el.textContent = dataHeader[index]);
        contentData.forEach((el,index) => el.textContent = valArr[index]);
    }  
}

function showImage(data) {
    if (data.dayTime === 'day' || data.dayTime === 'twilight') {
        imgObject.src = 'img/sun.svg';
        imgObject.style.width = '130px';
        imgObject.style.bottom = `calc(${roundAltitude(data.sunAltitude)}*2.28%)`;
    } else {
        imgObject.src = 'img/moon.svg';
        imgObject.style.width = '100px';
        imgObject.style.bottom = `calc(${roundAltitude(data.moonAltitude)}*2.28%)`;
    }

    function roundAltitude(data) {
        if (data > 38) return 38;
        else return data;
    }
}

function changeBackground(dayTime) {
    const contentBg = document.querySelector('.content');
    const listData = document.querySelector('.content-data');

    if (dayTime === 'day') {
        contentBg.classList.remove('content_night');
        contentBg.style.background = '#87ceeb';
        content.forEach(element => element.style.color = '#db7093');
    }
    else if (dayTime === 'twilight') {
        contentBg.classList.remove('content_night');
        contentBg.style.background = 'linear-gradient(315deg, #a31818, #eb9a40)';
        content.forEach(element => element.style.color = '#fff');
    }
    else if (dayTime === 'night') {
        contentBg.classList.add('content_night');
        content.forEach(element => element.style.color = '#fff');
    }
}

function showError(text, img) {
    errWrap.style.display = 'block';
    document.querySelector('.error-wrap h3').textContent = text;
    document.querySelector('.error-wrap img').src = img;
}


// Fav cities
function getFavCities() {
    const favMain = document.querySelector('.fav-main');
    const addBtn = document.querySelector('.add-fav');
    let favMainList = document.querySelector('.fav-cities');
    let cityArr = [];
    let menuOpenned = false;
    if (localStorage.getItem('favCity') !== null) {
        showCity();
        cityArr = localStorage.getItem('favCity').split(',');
    } else {
        getEmptyCity();
    }

    //Show city
    function showCity() {
        favMain.style.display = 'block';
        const listCityArr = localStorage.getItem('favCity').split(',');
        favMainList.innerHTML = '';
        for(let i = 0; i < listCityArr.length; i++) {
            favMainList.innerHTML += `<div class="fav-city__block"><button></button><span>${listCityArr[i]}</span></div>`;
        }
        removeCity();

        //Get weather by favorite city
        document.querySelectorAll('.fav-cities span').forEach(el => {
            el.onclick = () => {
                getData(el.textContent);
                if (menuOpenned) {
                    closeMenu();
                }
            }
        });
    }

    //Add city
    addBtn.addEventListener('click', addCity);
    function addCity() {  
        const city =  document.querySelector('.content h2').textContent;
        let cityList = localStorage.getItem('favCity');

        if (cityList !== null) {
            cityArr = cityList.split(',');
        }
        
        if (cityArr.includes(city) === true) {
            return;
        } else {
            cityArr.push(city);
            localStorage.setItem('favCity', cityArr);
            showCity();
        }
    }

    //Remove city
    function removeCity() {
        document.querySelectorAll('.fav-cities button').forEach((el, index) => {
            const cityItem = document.querySelectorAll('.fav-city__block');
            el.onclick = (e) => {
                e.preventDefault();
                cityItem[index].remove();
                cityArr.splice(index, 1);

                if (cityArr.length > 0) {
                    localStorage.setItem('favCity', cityArr);
                } else {
                    localStorage.removeItem('favCity');
                    getEmptyCity();
                }
            }
        });
    }

    function getEmptyCity() {
        favMain.style.display = 'none';
    }

    // Hamburger menu for fav cities
    const openHamburger = document.querySelector('.open-btn');
    const closeHamburger = document.querySelector('.fav-menu .close-btn');
    const favMenu = document.querySelector('.fav-menu');

    openHamburger.addEventListener('click', () => {
        favMenu.style.animation = '0.7s openMenu ease-out forwards';
        menuOpenned = true;
    });

    closeHamburger.addEventListener('click', closeMenu);

    function closeMenu() {
        favMenu.style.animation = '0.7s closeMenu ease-out forwards';
    }
}    


