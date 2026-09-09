/* ICT 실습 수첩 — 진행·수첩·시계 */
(function () {
  "use strict";

  var KEY = "ict-study-v1";
  var LEVELS = {
    beginner: { label: "초보자", note: "차트제로 영상 · BOS · 초크 · OB · FVG" },
    advanced: { label: "숙련자", note: "원전 ICT · 위치 · 시간 · OTE · 실버불릿" },
  };

  var STEPS = [
    { id: "01", title: "구조", short: "BOS · 초크", href: "steps/01.html", level: "beginner" },
    { id: "02", title: "자리", short: "FVG · 오더블록", href: "steps/02.html", level: "beginner" },
    { id: "03", title: "위치", short: "프리미엄 · 디스카운트", href: "steps/03.html", level: "advanced" },
    { id: "04", title: "시간", short: "킬존", href: "steps/04.html", level: "advanced" },
    { id: "05", title: "되돌림", short: "OTE", href: "steps/05.html", level: "advanced" },
    { id: "06", title: "모델", short: "실버불릿", href: "steps/06.html", level: "advanced" },
  ];

  var KZ = [
    { id: "kz-lon", name: "런던 킬존", start: 120, end: 300, kind: "kz" },
    { id: "kz-ny", name: "뉴욕 킬존", start: 420, end: 660, kind: "kz" },
    { id: "kz-lc", name: "런던 마감", start: 600, end: 720, kind: "kz" },
    { id: "sb-lon", name: "런던 실버불릿", start: 180, end: 240, kind: "sb" },
    { id: "sb-am", name: "뉴욕 오전 실버불릿", start: 600, end: 660, kind: "sb" },
    { id: "sb-pm", name: "뉴욕 오후 실버불릿", start: 840, end: 900, kind: "sb" },
  ];

  function emptyState() {
    return { steps: {}, sessions: [], playbook: {} };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return emptyState();
      var data = JSON.parse(raw);
      if (!data.steps) data.steps = {};
      if (!data.sessions) data.sessions = [];
      if (!data.playbook) data.playbook = {};
      return data;
    } catch (e) {
      return emptyState();
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function stepState(data, id) {
    if (!data.steps[id]) data.steps[id] = { checks: {}, mastered: false };
    return data.steps[id];
  }

  function prevId(id) {
    var i = STEPS.findIndex(function (s) {
      return s.id === id;
    });
    return i > 0 ? STEPS[i - 1].id : null;
  }

  function isMastered(data, id) {
    return !!(data.steps[id] && data.steps[id].mastered);
  }

  function isUnlocked(data, id) {
    var p = prevId(id);
    return !p || isMastered(data, p);
  }

  function masteredCount(data) {
    return STEPS.filter(function (s) {
      return isMastered(data, s.id);
    }).length;
  }

  function stepsByLevel(level) {
    return STEPS.filter(function (s) {
      return s.level === level;
    });
  }

  function masteredCountByLevel(data, level) {
    return stepsByLevel(level).filter(function (s) {
      return isMastered(data, s.id);
    }).length;
  }

  function renderPathCard(data, s) {
    var unlocked = isUnlocked(data, s.id);
    var mastered = isMastered(data, s.id);
    var status = mastered ? "익숙함" : unlocked ? "실습 중" : "이전 스텝 먼저";
    var cls = "path-card is-" + s.level;
    if (mastered) cls += " is-done";
    else if (!unlocked) cls += " is-lock";
    return (
      '<a class="' +
      cls +
      '" href="' +
      href(s.href) +
      '">' +
      '<span class="path-num">' +
      s.id +
      "</span>" +
      "<span class=\"path-body\"><strong>" +
      s.title +
      "</strong><em>" +
      s.short +
      "</em></span>" +
      '<span class="path-st">' +
      status +
      "</span>" +
      "</a>"
    );
  }

  function setMastered(id, on) {
    var data = load();
    var st = stepState(data, id);
    st.mastered = !!on;
    st.masteredAt = on ? new Date().toISOString() : null;
    if (!on) {
      var start = STEPS.findIndex(function (s) {
        return s.id === id;
      });
      for (var i = start + 1; i < STEPS.length; i++) {
        if (data.steps[STEPS[i].id]) data.steps[STEPS[i].id].mastered = false;
      }
    }
    save(data);
    return data;
  }

  function basePath() {
    var b = document.body && document.body.getAttribute("data-base");
    return b || ".";
  }

  function href(path) {
    var base = basePath();
    if (path.indexOf("steps/") === 0 && base === "..") {
      return path.replace(/^steps\//, "");
    }
    return (base === "." ? "" : base + "/") + path;
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function zonedParts(tz) {
    var fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    var parts = {};
    fmt.formatToParts(new Date()).forEach(function (p) {
      parts[p.type] = p.value;
    });
    return parts;
  }

  function minutesOf(parts) {
    return Number(parts.hour) * 60 + Number(parts.minute);
  }

  function activeWindows(mins) {
    return KZ.filter(function (w) {
      return mins >= w.start && mins < w.end;
    });
  }

  function fmtHm(mins) {
    return pad(Math.floor(mins / 60)) + ":" + pad(mins % 60);
  }

  function mountChrome() {
    var root = document.getElementById("chrome");
    if (!root) return;
    var data = load();
    var page = document.body.getAttribute("data-page") || "home";
    var done = masteredCount(data);
    var pct = Math.round((done / STEPS.length) * 100);

    var nav = STEPS.map(function (s) {
      var unlocked = isUnlocked(data, s.id);
      var mastered = isMastered(data, s.id);
      var current = page === "step-" + s.id;
      var cls = "dot is-" + s.level;
      if (mastered) cls += " is-done";
      else if (unlocked) cls += " is-open";
      else cls += " is-lock";
      if (current) cls += " is-now";
      return (
        '<a class="' +
        cls +
        '" href="' +
        href(s.href) +
        '" title="' +
        s.id +
        " " +
        s.title +
        '">' +
        s.id +
        "</a>"
      );
    }).join("");

    root.innerHTML =
      '<header class="top">' +
      '<a class="brand" href="' +
      href("index.html") +
      '"><span class="brand-mark">ICT</span> 실습 수첩</a>' +
      '<nav class="top-links">' +
      '<a href="' +
      href("playbook.html") +
      '"' +
      (page === "playbook" ? ' class="is-on"' : "") +
      ">실전 수첩</a>" +
      '<a href="' +
      href("session.html") +
      '"' +
      (page === "session" ? ' class="is-on"' : "") +
      ">오늘 실습</a>" +
      "</nav>" +
      "</header>" +
      '<div class="progress-bar" aria-label="진행률 ' +
      pct +
      '%">' +
      '<div class="progress-fill" style="width:' +
      pct +
      '%"></div>' +
      "</div>" +
      '<div class="dots" aria-label="스텝">' +
      nav +
      "</div>";
  }

  function bindChecks(scope, storeKey, bucket) {
    var data = load();
    var box = bucket === "playbook" ? data.playbook : stepState(data, storeKey).checks;
    scope.querySelectorAll("[data-check]").forEach(function (el) {
      var id = el.getAttribute("data-check");
      el.checked = !!box[id];
      el.addEventListener("change", function () {
        var d = load();
        var b = bucket === "playbook" ? d.playbook : stepState(d, storeKey).checks;
        b[id] = el.checked;
        save(d);
        refreshMastery(d);
      });
    });
  }

  function refreshMastery(data) {
    var btn = document.getElementById("mastery-btn");
    var note = document.getElementById("mastery-note");
    if (!btn) return;
    var id = btn.getAttribute("data-step");
    var unlocked = isUnlocked(data, id);
    var mastered = isMastered(data, id);
    btn.disabled = !unlocked && !mastered;
    btn.textContent = mastered ? "익숙함 해제 (다시 이 스텝)" : "이 스텝, 익숙하다고 표시";
    btn.classList.toggle("is-mastered", mastered);
    if (note) {
      if (!unlocked) {
        note.textContent = "이전 스텝을 익숙하다고 표시해야 여기서 넘어갈 수 있습니다.";
      } else if (mastered) {
        note.textContent = "다음 스텝이 열렸습니다. 언제든 이 페이지로 돌아와 복습하세요.";
      } else {
        note.textContent =
          "차트에서 혼자 그릴 수 있다고 느껴질 때만 누르세요. 체크를 다 했다고 자동으로 넘어가지 않습니다.";
      }
    }
  }

  function bindMastery() {
    var btn = document.getElementById("mastery-btn");
    if (!btn) return;
    var id = btn.getAttribute("data-step");
    btn.addEventListener("click", function () {
      var data = load();
      var now = isMastered(data, id);
      if (!now && !isUnlocked(data, id)) return;
      if (now && !confirm("이후 스텝의 익숙함도 함께 해제됩니다. 계속할까요?")) return;
      data = setMastered(id, !now);
      mountChrome();
      refreshMastery(data);
      paintLockBanners(data);
    });
    refreshMastery(load());
  }

  function paintLockBanners(data) {
    var id = document.body.getAttribute("data-step");
    var banner = document.getElementById("lock-banner");
    if (!id || !banner) return;
    if (isUnlocked(data, id)) {
      banner.hidden = true;
    } else {
      banner.hidden = false;
    }
  }

  function renderHome() {
    var data = load();
    ["beginner", "advanced"].forEach(function (level) {
      var list = document.getElementById("path-list-" + level);
      if (!list) return;
      list.innerHTML = stepsByLevel(level)
        .map(function (s) {
          return renderPathCard(data, s);
        })
        .join("");
    });
    var meter = document.getElementById("home-meter");
    if (meter) {
      var beg = masteredCountByLevel(data, "beginner");
      var adv = masteredCountByLevel(data, "advanced");
      meter.textContent =
        "초보 " +
        beg +
        " / " +
        stepsByLevel("beginner").length +
        " · 숙련 " +
        adv +
        " / " +
        stepsByLevel("advanced").length +
        " 스텝 익숙함";
    }
  }

  function renderClock() {
    var root = document.getElementById("kz-clock");
    if (!root) return;

    function tick() {
      var ny = zonedParts("America/New_York");
      var kr = zonedParts("Asia/Seoul");
      var mins = minutesOf(ny);
      var active = activeWindows(mins);
      var rows = KZ.map(function (w) {
        var on = mins >= w.start && mins < w.end;
        return (
          '<li class="' +
          (on ? "is-live" : "") +
          '"><span>' +
          w.name +
          '</span><time>' +
          fmtHm(w.start) +
          "–" +
          fmtHm(w.end) +
          " NY</time></li>"
        );
      }).join("");
      var live =
        active.length === 0
          ? "지금은 킬존·실버불릿 밖입니다. 구조를 표시만 하고 진입 연습은 창을 기다리세요."
          : "지금 창: " +
            active
              .map(function (w) {
                return w.name;
              })
              .join(" · ");
      root.innerHTML =
        '<div class="clock-now">' +
        "<p><strong>뉴욕</strong> " +
        ny.weekday +
        " " +
        ny.hour +
        ":" +
        ny.minute +
        "</p>" +
        "<p><strong>한국</strong> " +
        kr.hour +
        ":" +
        kr.minute +
        "</p>" +
        '<p class="clock-live">' +
        live +
        "</p>" +
        "</div>" +
        "<ul class=\"kz-list\">" +
        rows +
        "</ul>" +
        "<p class=\"hint\">시각은 뉴욕 로컬(서머타임 자동). 한국은 여름 +13시간, 겨울 +14시간.</p>";
    }

    tick();
    setInterval(tick, 15000);
  }

  function renderPlaybookGates() {
    var data = load();
    document.querySelectorAll("[data-need-step]").forEach(function (el) {
      var need = el.getAttribute("data-need-step");
      var ok = isUnlocked(data, need);
      el.classList.toggle("is-dim", !ok);
      var tag = el.querySelector(".gate-tag");
      if (tag) tag.textContent = ok ? "열림" : "스텝 " + need + " 이후";
    });
  }

  function bindPlaybookTabs() {
    var root = document.getElementById("playbook-tabs");
    if (!root) return;
    var zones = document.querySelectorAll(".playbook-zone");
    var key = "playbook-view";

    function apply(view) {
      root.querySelectorAll("[data-view]").forEach(function (btn) {
        btn.classList.toggle("is-on", btn.getAttribute("data-view") === view);
      });
      zones.forEach(function (zone) {
        var lv = zone.getAttribute("data-level");
        var show = view === "all" || view === lv;
        zone.hidden = !show;
      });
      try {
        sessionStorage.setItem(key, view);
      } catch (e) {}
    }

    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-view]");
      if (!btn) return;
      apply(btn.getAttribute("data-view"));
    });

    var saved = "beginner";
    try {
      saved = sessionStorage.getItem(key) || "beginner";
    } catch (e) {}
    apply(saved);
  }

  function bindSessions() {
    var form = document.getElementById("session-form");
    var list = document.getElementById("session-list");
    if (!form || !list) return;

    function paint() {
      var data = load();
      if (!data.sessions.length) {
        list.innerHTML = "<p class=\"empty\">아직 기록이 없습니다. 차트 한 장을 보고 남기세요.</p>";
        return;
      }
      list.innerHTML = data.sessions
        .slice()
        .reverse()
        .map(function (s) {
          return (
            "<article class=\"session-card\">" +
            "<header><strong>" +
            escapeHtml(s.symbol || "심볼 없음") +
            "</strong> · " +
            escapeHtml(s.tf || "") +
            " · 스텝 " +
            escapeHtml(s.step || "") +
            "</header>" +
            "<p>" +
            escapeHtml(s.note || "") +
            "</p>" +
            "<footer>" +
            (s.ok === "yes" ? "혼자 그렸다" : s.ok === "no" ? "헷갈렸다" : "기록만") +
            " · " +
            escapeHtml((s.at || "").slice(0, 16).replace("T", " ")) +
            ' <button type="button" data-del="' +
            s.id +
            '">삭제</button></footer>' +
            "</article>"
          );
        })
        .join("");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = load();
      var fd = new FormData(form);
      data.sessions.push({
        id: String(Date.now()),
        symbol: String(fd.get("symbol") || "").trim(),
        tf: String(fd.get("tf") || "").trim(),
        step: String(fd.get("step") || "").trim(),
        note: String(fd.get("note") || "").trim(),
        ok: String(fd.get("ok") || ""),
        at: new Date().toISOString(),
      });
      save(data);
      form.reset();
      paint();
    });

    list.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-del]");
      if (!btn) return;
      var data = load();
      data.sessions = data.sessions.filter(function (s) {
        return s.id !== btn.getAttribute("data-del");
      });
      save(data);
      paint();
    });

    paint();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bindBackup() {
    var exp = document.getElementById("export-btn");
    var imp = document.getElementById("import-file");
    var rst = document.getElementById("reset-btn");
    if (exp) {
      exp.addEventListener("click", function () {
        var blob = new Blob([JSON.stringify(load(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "ict-study-progress.json";
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }
    if (imp) {
      imp.addEventListener("change", function () {
        var file = imp.files && imp.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var data = JSON.parse(String(reader.result));
            if (!data.steps) throw new Error("형식");
            save(data);
            location.reload();
          } catch (err) {
            alert("가져올 수 없는 파일입니다.");
          }
        };
        reader.readAsText(file);
      });
    }
    if (rst) {
      rst.addEventListener("click", function () {
        if (!confirm("이 브라우저의 진행·체크·실습 기록을 모두 지울까요?")) return;
        localStorage.removeItem(KEY);
        location.reload();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    mountChrome();
    var data = load();
    var step = document.body.getAttribute("data-step");
    if (step) {
      bindChecks(document, step, "step");
      bindMastery();
      paintLockBanners(data);
    }
    if (document.body.getAttribute("data-page") === "playbook") {
      bindChecks(document, "playbook", "playbook");
      renderPlaybookGates();
      bindPlaybookTabs();
    }
    renderHome();
    renderClock();
    bindSessions();
    bindBackup();
  });
})();
