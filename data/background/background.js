chrome.runtime.onInstalled.addListener((details) => {
  let userAgent = (navigator && navigator.userAgent || '').toLowerCase();
  let isFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
  let isChrome = typeof chrome !== 'undefined' && !isFirefox;
  let urlForChrome = "https://chrome.google.com/webstore/detail/lookup-in-popup/akaefbhdlppmfdecoakjogglbjgacdhm/";
  let urlForFirefox = "https://addons.mozilla.org/en-US/firefox/addon/lookup-in-popup/";
  let onInstallLaunchUrl = (isChrome && !isFirefox) ? urlForChrome : urlForFirefox;
  if (details.reason == "install") {
    firstTime();
    chrome.tabs.create({ url: onInstallLaunchUrl }, function (tab) { });
  } else if (details.reason == "update") {
    chrome.tabs.create({ url: onInstallLaunchUrl }, function (tab) { });
  }
});


function firstTime() {
  chrome.storage.sync.set({
    dictionaries: [

      {
        "preInstalled": "true",
        "id": "googleTranslate",
        "title": "Google Translate",
        "isGoogleTranslate": true,
        "from": "auto", //default
        "to": "en", //default
        "url": dictionariesData.googleTranslate.generateUrl("auto", "en")
      }, {
        "preInstalled": "true",
        "id": "cambridge",
        "title": "Cambridge",
        "fromTo": "english",
        "url": dictionariesData.cambridge.generateUrl("english")
      }, {
        "preInstalled": "true",
        "id": "oxford",
        "title": "Oxford",
        "fromTo": "en",
        "url": dictionariesData.oxford.generateUrl("en")
      }, {
        "preInstalled": "true",
        "id": "collins",
        "title": "Collins",
        "fromTo": "english",
        "url": dictionariesData.collins.generateUrl("english")
      }, {
        "preInstalled": "true",
        "id": "longman",
        "title": "Longman",
        "fromTo": "english",
        "url": dictionariesData.longman.generateUrl("english")
      },

    ],
    dictionariesHidden: [],
    triggerKey: "none",
    enableDisable: {
      globally: "enable", //disabled|enabled
      listMode: "blacklist-mode", //blacklist-mode|whitelist-mode
      blacklist: [], //["someUrl", "anotherUrl", "sommeAnotherUrl"]
      whitelist: [] //["someUrl", "anotherUrl", "sommeAnotherUrl"]
    },
    showChooseDictionaryOptions: 'yes'
  });
}
