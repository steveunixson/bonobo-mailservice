(function () {
  addEvent(window, 'load', () => {
    if (isInternetExplorer()) polyfillDataUriDownload();
  });

  function polyfillDataUriDownload() {
    const links = document.querySelectorAll('a[download], area[download]');
    for (let index = 0, length = links.length; index < length; ++index) {
      (function (link) {
        const dataUri = link.getAttribute('href');
        const fileName = link.getAttribute('download');
        if (dataUri.slice(0, 5) != 'data:') throw new Error('The XHR part is not implemented here.');
        addEvent(link, 'click', (event) => {
          cancelEvent(event);
          try {
            const dataBlob = dataUriToBlob(dataUri);
            forceBlobDownload(dataBlob, fileName);
          } catch (e) {
            alert(e);
          }
        });
      }(links[index]));
    }
  }

  function forceBlobDownload(dataBlob, fileName) {
    window.navigator.msSaveBlob(dataBlob, fileName);
  }

  function dataUriToBlob(dataUri) {
    if (!(/base64/).test(dataUri)) throw new Error('Supports only base64 encoding.');
    const parts = dataUri.split(/[:;,]/);


    const type = parts[1];


    const binData = atob(parts.pop());


    const mx = binData.length;


    const uiArr = new Uint8Array(mx);
    for (let i = 0; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);
    return new Blob([uiArr], { type });
  }

  function addEvent(subject, type, listener) {
    if (window.addEventListener) subject.addEventListener(type, listener, false);
    else if (window.attachEvent) subject.attachEvent(`on${type}`, listener);
  }

  function cancelEvent(event) {
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;
  }

  function isInternetExplorer() {
    return /* @cc_on!@ */false || !!document.documentMode;
  }
}());
