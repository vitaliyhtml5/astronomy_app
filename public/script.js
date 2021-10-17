const city = document.querySelector('h2');
const content = document.querySelectorAll('.content-data tr>*');
const imgObject = document.querySelector('.object-way>img');
const formMain = document.querySelector('form');
const errWrap = document.querySelector('.error-wrap');
const loader = document.querySelector('.loader');


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

getData('London');
async function getData(cityValue) {
    loader.style.display = 'block';
    const res = await fetch(`/get_data?city=${cityValue}`);
    const data = await res.json();
    loader.style.display = 'none';
    fillData(data);
    showImage(data);
    if (data.code === 500) {
        showError(data.message, 'img/500.png');
    }
}

function fillData(data) {
    const headerData = document.querySelectorAll('.content-data th');
    const contentData = document.querySelectorAll('.content-data td');
    const sunArr = ['Local time: ','Sunrise: ','Sunset: ','Solar noon: '];
    const sunValArr = [data.time, data.sunrise, data.sunset, data.solar_noon];
    const moonArr = ['Local time: ','Moonrise: ','Moonset: ','Distance: '];
    const moonValArr = [data.time, data.moonrise, data.moonset, data.moon_phase];
    const toggle = document.querySelector('.toggle button');
    const title = document.querySelectorAll('.toggle b');
    
    changeBackground(data.day_time);
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
    if (data.day_time === 'day' || data.day_time === 'twilight') {
        imgObject.src = 'img/sun.svg';
        imgObject.style.width = '130px';
        imgObject.style.bottom = `calc(${roundAltitude(data.sun_altitude)}*2.28%)`;
    } else {
        imgObject.src = 'img/moon.svg';
        imgObject.style.width = '100px';
        imgObject.style.bottom = `calc(${roundAltitude(data.moon_altitude)}*2.28%)`;
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
        contentBg.style.background = 'linear-gradient(315deg, rgb(163 24 24), rgb(235 154 64)';
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




