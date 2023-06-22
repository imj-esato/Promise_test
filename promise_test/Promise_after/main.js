/* eslint no-unused-vars: 0 */
const rootElm = document.getElementById('areaSelector');

function initAreaSelector() {
  updatePref()
    .then(updateCity)
    .catch(error => {
      console.error('Error initializing area selector:', error);
    });
}

function getPrefs() {
  return new Promise((resolve, reject) => {
    // 都道府県データの取得
    fetch('./prefectures.json')
      .then(response => response.json())
      .then(resolve) // 取得成功時にデータを解決
      .catch(reject); // エラー発生時にリジェクト
  });
}

function getCities(prefCode) {
  return new Promise((resolve, reject) => {
    // 選択された都道府県の市町村データの取得
    fetch(`./cities/${prefCode}.json`)
      .then(response => response.json())
      .then(resolve) // 取得成功時にデータを解決
      .catch(reject); // エラー発生時にリジェクト
  });
}

function updatePref() {
  return getPrefs()
    .then(prefs => {
      createPrefOptionsHtml(prefs); // 都道府県のオプションを作成
    })
    .catch(error => {
      console.error('Error updating prefectures:', error);
    });
}

function updateCity() {
  const prefSelectorElm = rootElm.querySelector('.prefectures');
  return getCities(prefSelectorElm.value)
    .then(cities => {
      createCityOptionsHtml(cities); // 市町村のオプションを作成
    })
    .catch(error => {
      console.error('Error updating cities:', error);
    });
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

  prefSelectorElm.addEventListener('change', (event) => {
    updateCity(); // 都道府県が変更されたときに市町村を更新
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
