/* ICT 실습 수첩 — 교육용 차트 (캔들·가로선·FVG 꼬리 갭) */
(function () {
  "use strict";

  var C = {
    bg: "#f8fafc",
    up: "#059669",
    down: "#e11d48",
    wick: "#64748b",
    bos: "#0284c7",
    choch: "#7c3aed",
    fvg: "rgba(37, 99, 235, 0.2)",
    fvgLine: "#2563eb",
    ote: "rgba(124, 58, 237, 0.16)",
    oteLine: "#7c3aed",
    fib: "#94a3b8",
    text: "#0f172a",
    muted: "#64748b",
  };

  function candle(x, o, h, l, cl, w) {
    w = w || 16;
    var cx = x + w / 2;
    var top = Math.min(o, cl);
    var bodyH = Math.max(Math.abs(cl - o), 2.5);
    var bull = cl < o;
    var fill = bull ? C.up : C.down;
    return (
      '<line x1="' +
      cx +
      '" y1="' +
      h +
      '" x2="' +
      cx +
      '" y2="' +
      l +
      '" stroke="' +
      C.wick +
      '" stroke-width="1.5"/>' +
      '<rect x="' +
      x +
      '" y="' +
      top +
      '" width="' +
      w +
      '" height="' +
      bodyH +
      '" fill="' +
      fill +
      '" rx="1.5"/>'
    );
  }

  function hline(y, x1, x2, color, dash, width) {
    var dashAttr = dash === "" ? "" : ' stroke-dasharray="' + (dash || "7 5") + '"';
    return (
      '<line x1="' +
      x1 +
      '" y1="' +
      y +
      '" x2="' +
      x2 +
      '" y2="' +
      y +
      '" stroke="' +
      (color || C.bos) +
      '" stroke-width="' +
      (width || 2) +
      '"' +
      dashAttr +
      "/>"
    );
  }

  function txt(x, y, label, opts) {
    opts = opts || {};
    return (
      '<text x="' +
      x +
      '" y="' +
      y +
      '" fill="' +
      (opts.color || C.text) +
      '" font-size="' +
      (opts.size || 12) +
      '" font-weight="' +
      (opts.weight || 600) +
      '" font-family="JetBrains Mono, IBM Plex Mono, monospace">' +
      label +
      "</text>"
    );
  }

  function panelDivider(x) {
    return (
      '<line x1="' +
      x +
      '" y1="12" x2="' +
      x +
      '" y2="208" stroke="#e2e8f0" stroke-width="1"/>'
    );
  }

  function bosChochSvg() {
    var bosY = 108;
    var chochY = 82;
    var s = '<rect width="640" height="220" fill="' + C.bg + '"/>';
    s += panelDivider(320);
    s += txt(16, 22, "상승 BOS", { size: 13 });
    s += txt(16, 38, "직전 고점 = 가로선 · 종가가 선 위", { color: C.muted, size: 10, weight: 500 });

    s += candle(24, 170, 165, 172, 167);
    s += candle(46, 167, 150, 168, 152);
    s += candle(68, 152, 128, 153, 132);
    s += candle(90, 132, 136, 146, 142);
    s += candle(112, 142, 138, 152, 148);
    s += candle(134, 148, 92, 150, 98);
    s += hline(bosY, 18, 178, C.bos);
    s += txt(182, bosY + 4, "BOS", { color: C.bos, size: 11 });
    s += txt(182, bosY + 18, "직전 고점", { color: C.muted, size: 9, weight: 500 });

    s += txt(336, 22, "하락 중 초크 (CHoCH)", { size: 13 });
    s += txt(336, 38, "마지막 BOS 고점 = 가로선 · 종가 돌파", { color: C.muted, size: 10, weight: 500 });

    s += candle(364, 48, 45, 52, 48);
    s += candle(386, 48, 68, 50, 65);
    s += candle(408, 65, 88, 68, 85);
    s += candle(430, 85, 108, 88, 104);
    s += candle(452, 104, 100, 114, 108);
    s += candle(474, 108, 72, 110, 76);
    s += hline(chochY, 358, 518, C.choch);
    s += txt(522, chochY + 4, "ChoCH", { color: C.choch, size: 11 });
    s += txt(522, chochY + 18, "마지막 BOS 고점", { color: C.muted, size: 9, weight: 500 });

    s +=
      '<circle cx="178" cy="' +
      bosY +
      '" r="3" fill="' +
      C.bos +
      '"/><circle cx="518" cy="' +
      chochY +
      '" r="3" fill="' +
      C.choch +
      '"/>';
    return s;
  }

  function fvgSvg() {
    var c1High = 102;
    var c3Low = 72;
    var gapTop = c3Low;
    var gapBottom = c1High;
    var mid = (gapTop + gapBottom) / 2;
    var s = '<rect width="640" height="240" fill="' + C.bg + '"/>';
    s += panelDivider(320);
    s += txt(16, 22, "상승 FVG", { size: 13 });
    s += txt(16, 38, "1번 고(꼬리) ↔ 3번 저(꼬리) 사이 갭", { color: C.muted, size: 10, weight: 500 });

    s += candle(36, 128, 102, 138, 132);
    s += candle(68, 132, 38, 134, 44, 20);
    s += candle(104, 46, 34, 72, 40);

    s +=
      '<rect x="28" y="' +
      gapTop +
      '" width="100" height="' +
      (gapBottom - gapTop) +
      '" fill="' +
      C.fvg +
      '" stroke="' +
      C.fvgLine +
      '" stroke-width="1" stroke-dasharray="4 3" rx="4"/>';
    s += hline(c1High, 28, 128, C.fvgLine, "5 4", 1.5);
    s += hline(c3Low, 28, 128, C.fvgLine, "5 4", 1.5);
    s += hline(mid, 28, 128, C.muted, "3 4", 1);
    s += txt(132, c1High + 4, "1번 고", { color: C.fvgLine, size: 10 });
    s += txt(132, c3Low + 4, "3번 저", { color: C.fvgLine, size: 10 });
    s += txt(132, mid + 4, "50%", { color: C.muted, size: 10, weight: 500 });
    s += txt(44, gapTop + 16, "FVG", { color: C.fvgLine, size: 11 });

    s += txt(336, 22, "오더블록 (OB)", { size: 13 });
    s += txt(336, 38, "장대 직전 반대색 짧은 캔들", { color: C.muted, size: 10, weight: 500 });

    s += candle(372, 138, 134, 142, 140, 14);
    s += candle(396, 140, 48, 142, 52, 22);
    s +=
      '<rect x="368" y="128" width="22" height="18" fill="none" stroke="' +
      C.down +
      '" stroke-width="1.5" stroke-dasharray="3 2" rx="2"/>';
    s += txt(368, 124, "OB", { color: C.down, size: 10 });
    s += txt(430, 52, "장대", { color: C.up, size: 10, weight: 500 });

    return s;
  }

  function pdSvg() {
    var yHigh = 48;
    var yLow = 208;
    var y50 = Math.round((yHigh + yLow) / 2);
    var s = '<rect width="640" height="260" fill="' + C.bg + '"/>';

    s +=
      '<rect x="36" y="' +
      yHigh +
      '" width="500" height="' +
      (y50 - yHigh) +
      '" fill="rgba(225, 29, 72, 0.10)"/>';
    s +=
      '<rect x="36" y="' +
      y50 +
      '" width="500" height="' +
      (yLow - y50) +
      '" fill="rgba(5, 150, 105, 0.10)"/>';

    s += hline(yHigh, 36, 536, C.fib, "4 4", 1);
    s += hline(yLow, 36, 536, C.fib, "4 4", 1);
    s += hline(y50, 36, 536, "#0f172a", "", 2);

    s += candle(52, 198, 190, 208, 192);
    s += candle(76, 192, 168, 194, 172);
    s += candle(100, 172, 148, 174, 152);
    s += candle(124, 152, 118, 154, 122);
    s += candle(148, 122, 88, 124, 92);
    s += candle(172, 92, 48, 94, 54);

    s += candle(208, 54, 56, 72, 68);
    s += candle(232, 68, 70, 96, 90);
    s += candle(256, 90, 92, 118, 112);
    s += candle(280, 112, 108, 148, 142);

    s +=
      '<rect x="248" y="148" width="56" height="18" fill="rgba(37, 99, 235, 0.22)" stroke="#2563eb" stroke-width="1" rx="3"/>';
    s += txt(250, 140, "FVG D", { color: C.up, size: 10 });

    s +=
      '<rect x="196" y="62" width="48" height="16" fill="rgba(225, 29, 72, 0.12)" stroke="#e11d48" stroke-width="1" stroke-dasharray="3 2" rx="3"/>';
    s += txt(196, 56, "FVG P", { color: C.down, size: 10 });

    s += txt(16, 22, "같은 스윙의 50%", { size: 13 });
    s += txt(16, 38, "위 = 프리미엄(비싼 쪽) · 아래 = 디스카운트(싼 쪽)", { color: C.muted, size: 10, weight: 500 });
    s += txt(548, yHigh + 4, "고점", { color: C.muted, size: 10, weight: 500 });
    s += txt(548, y50 + 4, "50%", { color: C.text, size: 11 });
    s += txt(548, yLow + 4, "저점", { color: C.muted, size: 10, weight: 500 });
    s += txt(400, yHigh + 28, "프리미엄 · 숏", { color: C.down, size: 11 });
    s += txt(400, yLow - 16, "디스카운트 · 롱", { color: C.up, size: 11 });
    s += txt(248, 228, "상승이면 D만 남김 · P는 관찰만", { color: C.muted, size: 10, weight: 500 });

    return s;
  }

  function oteSvg() {
    var y0 = 58;
    var y1 = 348;
    var range = y1 - y0;
    var y50 = Math.round(y0 + range * 0.5);
    var y618 = Math.round(y0 + range * 0.618);
    var y705 = Math.round(y0 + range * 0.705);
    var y79 = Math.round(y0 + range * 0.79);
    var s = '<rect width="640" height="400" fill="' + C.bg + '"/>';

    s +=
      '<rect x="36" y="' +
      y0 +
      '" width="470" height="' +
      (y50 - y0) +
      '" fill="rgba(225, 29, 72, 0.07)"/>';
    s +=
      '<rect x="36" y="' +
      y50 +
      '" width="470" height="' +
      (y1 - y50) +
      '" fill="rgba(5, 150, 105, 0.07)"/>';

    s +=
      '<rect x="36" y="' +
      y618 +
      '" width="470" height="' +
      Math.max(y705 - y618, 18) +
      '" fill="' +
      C.ote +
      '" stroke="' +
      C.oteLine +
      '" stroke-width="1.5" rx="4"/>';

    s += hline(y0, 36, 506, C.fib, "4 4", 1);
    s += hline(y1, 36, 506, C.fib, "4 4", 1);
    s += hline(y50, 36, 506, "#0f172a", "", 1.8);
    s += hline(y618, 36, 506, C.oteLine, "6 4", 1.8);
    s += hline(y705, 36, 506, C.oteLine, "6 4", 1.8);
    s += hline(y79, 36, 506, C.fib, "2 4", 1);

    var scale = range / 172;
    function cy(old) {
      return Math.round(y0 + (old - 56) * scale);
    }

    s += candle(48, cy(220), cy(212), cy(228), cy(214));
    s += candle(72, cy(214), cy(184), cy(216), cy(188));
    s += candle(96, cy(188), cy(156), cy(190), cy(160));
    s += candle(120, cy(160), cy(124), cy(162), cy(128));
    s += candle(144, cy(128), cy(94), cy(130), cy(98));
    s += candle(168, cy(98), cy(56), cy(100), cy(62));

    s += candle(204, cy(62), cy(66), cy(86), cy(82));
    s += candle(228, cy(82), cy(84), cy(114), cy(110));
    s += candle(252, cy(110), cy(112), cy(144), cy(138));
    s += candle(276, cy(138), cy(126), cy(154), cy(150));
    s += candle(300, cy(150), cy(148), cy(174), cy(168));

    s += txt(16, 22, "롱 OTE · 캔들 되돌림", { size: 13 });
    s += txt(16, 38, "0=고점 · 1.0=저점. 보라 띠만 OTE (0.618–0.705). 0.79는 여유선", {
      color: C.muted,
      size: 10,
      weight: 500,
    });
    s += txt(520, y0 + 4, "0 고점", { color: C.muted, size: 10, weight: 500 });
    s += txt(520, y50 + 4, "0.5 균형", { color: C.text, size: 10 });
    s += txt(520, y618 + 4, "0.618", { color: C.oteLine, size: 10 });
    s += txt(520, y705 + 4, "0.705", { color: C.oteLine, size: 10 });
    s += txt(520, y79 + 14, "0.79 여유", { color: C.muted, size: 10, weight: 500 });
    s += txt(520, y1 + 4, "1.0 저점", { color: C.muted, size: 10, weight: 500 });
    s += txt(44, y618 + Math.round((y705 - y618) / 2) + 4, "OTE", { color: C.oteLine, size: 12 });
    s += txt(330, y0 + 28, "프리미엄", { color: C.down, size: 11, weight: 500 });
    s += txt(330, y1 - 14, "디스카운트", { color: C.up, size: 11, weight: 500 });

    return s;
  }

  var CHARTS = {
    "bos-choch": { svg: bosChochSvg, viewBox: "0 0 640 220", label: "BOS 가로선과 ChoCH 가로선" },
    fvg: { svg: fvgSvg, viewBox: "0 0 640 240", label: "FVG 꼬리 갭과 오더블록" },
    pd: { svg: pdSvg, viewBox: "0 0 640 260", label: "프리미엄 디스카운트와 50% 가로선" },
    ote: { svg: oteSvg, viewBox: "0 0 640 400", label: "OTE 되돌림 캔들" },
  };

  function mountCharts() {
    document.querySelectorAll("[data-chart]").forEach(function (el) {
      var key = el.getAttribute("data-chart");
      var spec = CHARTS[key];
      if (!spec) return;
      el.innerHTML =
        '<svg viewBox="' +
        spec.viewBox +
        '" role="img" aria-label="' +
        spec.label +
        '" class="chart-svg">' +
        spec.svg() +
        "</svg>";
    });
  }

  document.addEventListener("DOMContentLoaded", mountCharts);
})();
