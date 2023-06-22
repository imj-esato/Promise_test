/* eslint no-unused-vars: 0 */
const rootElm = document.getElementById('areaSelector');
let prefsData; // 都道府県データを格納する変数
let citiesData; // 市町村データを格納する変数

async function initAreaSelector() {
  try {
    await getPrefsAndCities();
    updatePref();
    updateCity();
  } catch (error) {
    console.error('Error initializing area selector:', error);
  }
}

async function getPrefsAndCities() {
  try {
    const prefsResponse = await fetch('./prefectures.json');
    prefsData = await prefsResponse.json();
    const prefSelectorElm = rootElm.querySelector('.prefectures');
    prefSelectorElm.addEventListener('change', () => {
      updateCity();
    });
    const cityPromises = prefsData.map(pref => getCities(pref.code));
    citiesData = await Promise.all(cityPromises);
  } catch (error) {
    throw error;
  }
}

function getCities(prefCode) {
  return new Promise(async (resolve, reject) => {
    try {
      const citiesResponse = await fetch(`./cities/${prefCode}.json`);
      const citiesData = await citiesResponse.json();
      resolve(citiesData);
    } catch (error) {
      reject(error);
    }
  });
}

function updatePref() {
  createPrefOptionsHtml(prefsData);
}

function updateCity() {
  const prefSelectorElm = rootElm.querySelector('.prefectures');
  const prefCode = prefSelectorElm.value;
  const cities = citiesData.find(city => city[0].prefCode === prefCode);
  createCityOptionsHtml(cities);
}

function createPrefOptionsHtml(prefs) {
  const optionStrs = prefs.map(pref => `
    <option name="${pref.name}" value="${pref.code}">
      ${pref.name}
    </option>
  `);

  const prefSelectorElm = rootElm.querySelector('.prefectures');
  prefSelectorElm.innerHTML = optionStrs.join('');
}

function createCityOptionsHtml(cities) {
  const optionStrs = cities.map(city => `
    <option name="${city.name}" value="${city.code}">
      ${city.name}
    </option>
  `);

  const citySelectorElm = rootElm.querySelector('.cities');
  citySelectorElm.innerHTML = optionStrs.join('');
}

initAreaSelector();
