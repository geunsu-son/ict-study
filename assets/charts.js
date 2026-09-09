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
      '" stroke-dasharray="' +
      (dash || "7 5") +
      '"/>'
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

  function oteSvg() {
    var y0 = 36;
    var y1 = 188;
    var range = y1 - y0;
    var y618 = Math.round(y1 - range * 0.618);
    var y705 = Math.round(y1 - range * 0.705);
    var y50 = Math.round(y1 - range * 0.5);
    var s = '<rect width="640" height="250" fill="' + C.bg + '"/>';

    s += hline(y0, 40, 600, C.fib, "4 4", 1);
    s += hline(y1, 40, 600, C.fib, "4 4", 1);
    s += hline(y50, 40, 600, C.fib, "3 5", 1);
    s += hline(y618, 40, 600, C.oteLine, "7 5", 1.5);
    s += hline(y705, 40, 600, C.oteLine, "7 5", 1.5);

    s +=
      '<rect x="40" y="' +
      y705 +
      '" width="560" height="' +
      (y618 - y705) +
      '" fill="' +
      C.ote +
      '" stroke="' +
      C.oteLine +
      '" stroke-width="1" rx="4"/>';

    s += txt(44, y0 - 6, "0 · 스윙 고점", { color: C.muted, size: 10, weight: 500 });
    s += txt(44, y1 + 14, "1.0 · 스윙 저점", { color: C.muted, size: 10, weight: 500 });
    s += txt(548, y618 + 4, "0.618", { color: C.oteLine, size: 10 });
    s += txt(548, y705 + 4, "0.705", { color: C.oteLine, size: 10 });
    s += txt(548, y50 + 4, "0.5", { color: C.muted, size: 10, weight: 500 });
    s += txt(260, y705 + (y618 - y705) / 2 + 4, "OTE", { color: C.oteLine, size: 11 });

    s += candle(52, 188, 182, 190, 178);
    s += candle(76, 178, 150, 180, 155);
    s += candle(100, 155, 120, 158, 125);
    s += candle(124, 125, 95, 128, 100);
    s += candle(148, 100, 72, 102, 78);
    s += candle(172, 78, 48, 80, 52);

    s += candle(208, 52, 55, 58, 56);
    s += candle(232, 56, 68, 58, 65);
    s += candle(256, 65, 82, 68, 78);
    s += candle(280, 78, 88, 90, 84);
    s += candle(304, 84, 92, 96, 88);

    s += txt(16, 22, "롱 OTE · 캔들 되돌림", { size: 13 });
    s += txt(16, 38, "추진(왼쪽) → 0.618–0.705 띠(보라) 안으로 눌림", { color: C.muted, size: 10, weight: 500 });

    return s;
  }

  var CHARTS = {
    "bos-choch": { svg: bosChochSvg, viewBox: "0 0 640 220", label: "BOS 가로선과 ChoCH 가로선" },
    fvg: { svg: fvgSvg, viewBox: "0 0 640 240", label: "FVG 꼬리 갭과 오더블록" },
    ote: { svg: oteSvg, viewBox: "0 0 640 250", label: "OTE 되돌림 캔들" },
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
