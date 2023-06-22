/* eslint no-unused-vars: 0 */
const rootElm = document.getElementById('areaSelector');

// 都道府県データの取得
function getPrefs() {
  return fetch('./prefectures.json').then(response => response.json());
}

// 市町村データの取得
function getCities(prefCode) {
  return fetch(`./cities/${prefCode}.json`).then(response => response.json());
}

// 初期化処理
async function initAreaSelector() {
  try {
    // Promise.allを使用して都道府県データと市町村データを並行して取得
    const [prefs, cities] = await Promise.all([getPrefs(), getCities('01')]);

    // 都道府県のオプションを作成
    createPrefOptionsHtml(prefs);

    // 市町村のオプションを作成
    createCityOptionsHtml(cities);
  } catch (error) {
    console.error('Error initializing area selector:', error);
  }
}

function createPrefOptionsHtml(prefs) {
  const optionStrs = [];
  for (const pref of prefs) {
    optionStrs.push(`
      <option name="${pref.name}" value="${pref.code}">
        ${pref.name}
      </option>
    `);
  }

  const prefSelectorElm = rootElm.querySelector('.prefectures');
  prefSelectorElm.innerHTML = optionStrs.join('');

  prefSelectorElm.addEventListener('change', () => {
    // 都道府県が変更されたときに市町村を更新
    const selectedPrefCode = prefSelectorElm.value;
    const selectedCities = citiesData[selectedPrefCode];
    createCityOptionsHtml(selectedCities);
  });
}

function createCityOptionsHtml(cities) {
  const optionStrs = [];
  for (const city of cities) {
    optionStrs.push(`
      <option name="${city.name}" value="${city.code}">
        ${city.name}
      </option>
    `);
  }

  const citySelectorElm = rootElm.querySelector('.cities');
  citySelectorElm.innerHTML = optionStrs.join('');
}

initAreaSelector();
