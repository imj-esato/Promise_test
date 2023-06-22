/* eslint no-unused-vars: 0 */
const rootElm = document.getElementById('areaSelector');
let prefsData; // 都道府県データを格納する変数
let citiesData; // 市町村データを格納する変数

function initAreaSelector() {
   // 都道府県データと市町村データの取得&初期化
  getPrefsAndCities()
    .then(() => {
      updatePref();// 都道府県のオプションを作成
      updateCity();// 市町村のオプションを作成
    })
    .catch(error => {
      //なかったらこっちでエラー
      console.error('Error initializing area selector:', error);
    });
}

function getPrefsAndCities() {
  return new Promise((resolve, reject) => {
    // 都道府県データの取得
    fetch('./prefectures.json')
      .then(response => response.json())
      .then(prefs => {
        prefsData = prefs; // 取得した都道府県データを変数に保存
        const prefSelectorElm = rootElm.querySelector('.prefectures');
        prefSelectorElm.addEventListener('change', () => {
          updateCity();  // 都道府県が変更されたときに市町村を更新するイベントリスナーを設定
        });
        // 全ての都道府県に対して市町村データの非同期取得を行い、Promiseの配列を返す
        return Promise.all(prefs.map(pref => getCities(pref.code)));
      })
      .then(cities => {
        citiesData = cities; // 取得した市町村データを変数に保存
        resolve();// Promiseを解決して初期化完了を通知
      })
      .catch(reject);// エラーが発生した場合はPromiseを拒否して初期化失敗を通知
  });
}
function getCities(prefCode) {
  return new Promise((resolve, reject) => {
    // 選択された都道府県の市町村データの取得
    fetch(`./cities/${prefCode}.json`)
      .then(response => response.json())
      .then(resolve)// 取得成功時にデータを解決
      .catch(reject);// エラー発生時にリジェクト
  });
}

function updatePref() {
  createPrefOptionsHtml(prefsData); // 都道府県のオプションを作成
}

function updateCity() {
  const prefSelectorElm = rootElm.querySelector('.prefectures');
  const prefCode = prefSelectorElm.value;
  const cities = citiesData.find(city => city[0].prefCode === prefCode);
  createCityOptionsHtml(cities);
}

// 更新
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
