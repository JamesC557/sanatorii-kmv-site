(function () {
  var C = window.SITE_CONFIG || {};
  // Метрика
  if (C.metrikaId) {
    (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) }; m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a) })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    ym(C.metrikaId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  }
  function goal(n) { try { if (C.metrikaId) ym(C.metrikaId, 'reachGoal', n); } catch (e) {} }

  // UTM / yclid сохраняем на сессию
  var params = new URLSearchParams(location.search), keys = ['yclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  function store(k, v) { try { sessionStorage.setItem(k, v) } catch (e) {} }
  function load(k) { try { return sessionStorage.getItem(k) || '' } catch (e) { return '' } }
  if (!load('first_landing')) store('first_landing', location.href);
  keys.forEach(function (k) { var v = params.get(k); if (v) store(k, v); });

  document.querySelectorAll('[data-goal]').forEach(function (a) { a.addEventListener('click', function () { goal(a.dataset.goal) }) });
  document.querySelectorAll('[data-resort]').forEach(function (a) {
    a.addEventListener('click', function () { var r = document.querySelector('input[name=resort][value="' + a.dataset.resort + '"]'); if (r) r.checked = true; });
  });


  // Заголовок под группу объявлений (utm_content = g1_..., g2_..., g3_...; для проверки ?g=g1)
  var HERO = {
    g1: { k: 'Кисловодск · нарзан и горный воздух', t: 'Санатории Кисловодска — подбор под ваше лечение', l: 'Подберём санаторий в Кисловодске по профилю лечения и бюджету. Путёвка по цене санатория, плюс дорога и трансфер.', r: 'Кисловодск' },
    g2: { k: 'Ессентуки · питьевые воды и грязелечение', t: 'Санатории Ессентуков — желудок, печень, диабет', l: 'Сравним санатории Ессентуков с сильным профилем ЖКТ и обмена веществ. Путёвка, дорога и трансфер — в одних руках.', r: 'Ессентуки' }
  };
  var gkey = ((params.get('g') || params.get('utm_content') || load('utm_content') || '').match(/^g\d/) || [''])[0];
  var hv = HERO[gkey];
  if (hv) {
    document.getElementById('heroKicker').textContent = hv.k;
    document.getElementById('heroTitle').textContent = hv.t;
    document.getElementById('heroLead').textContent = hv.l;
    var rr = document.querySelector('input[name=resort][value="' + hv.r + '"]'); if (rr) rr.checked = true;
  }
  if (gkey) document.querySelectorAll('.resort[data-g="' + gkey + '"]').forEach(function (el) { el.classList.add('is-match') });
  if (C.phone) { var tp = document.getElementById('topPhone'); tp.hidden = false; tp.textContent = C.phone; tp.href = 'tel:' + C.phone.replace(/[^\d+]/g, ''); }
  document.querySelectorAll('[data-profile]').forEach(function (a) {
    a.addEventListener('click', function () { var c = document.querySelector('input[name=profile][value="' + a.dataset.profile + '"]'); if (c) c.checked = true; });
  });

  var form = document.getElementById('q'); if (!form) return;
  var steps = [].slice.call(form.querySelectorAll('.qstep')), cur = 0, started = false;
  var next = document.getElementById('next'), back = document.getElementById('back'), send = document.getElementById('send'), prog = document.getElementById('prog'), status = document.getElementById('qstatus');
  var phone = form.phone;

  function show(i) {
    steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i) });
    cur = i; back.hidden = i === 0; next.hidden = i === steps.length - 1; send.hidden = i !== steps.length - 1;
    prog.textContent = 'Вопрос ' + (i + 1) + ' из ' + steps.length; document.getElementById('qbarFill').style.width = ((i + 1) / steps.length * 100) + '%'; status.textContent = '';
    if (i > 0) goal('quiz_step_' + (i + 1));
  }
  form.addEventListener('change', function () { if (!started) { started = true; goal('quiz_start'); } });
  next.addEventListener('click', function () {
    if (cur === 0 && !form.querySelector('input[name=profile]:checked')) { status.textContent = 'Отметьте хотя бы один вариант'; return; }
    show(Math.min(cur + 1, steps.length - 1));
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  back.addEventListener('click', function () { show(Math.max(cur - 1, 0)) });

  function digits(v) { return String(v || '').replace(/\D/g, '') }
  function fmt(v) { var d = digits(v); if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11); var r = d.slice(1), o = '+7'; if (r.length) o += ' (' + r.slice(0, 3); if (r.length >= 3) o += ')'; if (r.length > 3) o += ' ' + r.slice(3, 6); if (r.length > 6) o += '-' + r.slice(6, 8); if (r.length > 8) o += '-' + r.slice(8, 10); return o + (r.length ? '' : ' '); }
  phone.addEventListener('input', function () { phone.value = fmt(phone.value) });

  function val(n) { var el = form.querySelector('[name="' + n + '"]:checked') || form.querySelector('[name="' + n + '"]:not([type=radio]):not([type=checkbox])'); return el ? el.value.trim() : ''; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    [form.name, phone].forEach(function (f) { f.closest('label').classList.remove('has-error') });
    if (!form.name.value.trim()) { form.name.closest('label').classList.add('has-error'); ok = false; }
    if (digits(phone.value).length !== 11) { phone.closest('label').classList.add('has-error'); ok = false; }
    if (!form.privacy_consent.checked) ok = false;
    if (!ok) { status.textContent = 'Проверьте имя, телефон и согласие на обработку данных'; return; }

    var profiles = [].map.call(form.querySelectorAll('input[name=profile]:checked'), function (x) { return x.value }).join(', ');
    var summary = [
      'Лечение: ' + profiles,
      'Курорт: ' + (val('resort') || '—'),
      'Заезд: ' + (val('month') || '—') + ', длительность: ' + (val('nights') || '—'),
      'Возраст: ' + (val('age') || '—') + ', бюджет на чел.: ' + (val('budget') || '—'),
      'Дорога и трансфер: ' + (form.need_trip.checked ? 'нужны' : 'не нужны'),
      'Связь: ' + val('channel'),
      val('comment') ? 'Комментарий: ' + val('comment') : ''
    ].filter(Boolean).join('\n');

    var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'kmv-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    var b = new URLSearchParams();
    b.set('product_id', C.productId); b.set('tour_name', C.productName); b.set('format', 'санаторий');
    b.set('source', C.source); b.set('submission_id', id);
    b.set('name', form.name.value.trim()); b.set('phone', phone.value);
    b.set('adults', String(Math.max(1, +form.adults.value || 1))); b.set('children', String(Math.max(0, +form.children.value || 0)));
    b.set('comment', summary); b.set('privacy_consent', 'yes');
    b.set('page_url', location.href); b.set('first_landing_page', load('first_landing') || location.href);
    keys.forEach(function (k) { var v = params.get(k) || load(k); if (v) b.set(k, v); });

    send.disabled = true; send.textContent = 'Отправляем…';
    fetch(C.endpoint, { method: 'POST', mode: 'no-cors', body: b, keepalive: true }).catch(function () {});
    goal('lead_sent');
    setTimeout(function () { form.hidden = true; document.getElementById('done').hidden = false; }, 600);
  });
})();
