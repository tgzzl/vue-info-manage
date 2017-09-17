(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    metaEl = document.querySelector('meta[name="viewport"]'),
    recalc = function () {
      var clientWidth = docEl.clientWidth,
        dpr = win.devicePixelRatio || 1,
        scale = 1 / dpr;
      if (!clientWidth) return;
      // 设置viewport，进行缩放，达到高清效果
      // metaEl.setAttribute('content', 'width=' + dpr * clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no');

      docEl.style.fontSize = (clientWidth / 10) + 'px';
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
