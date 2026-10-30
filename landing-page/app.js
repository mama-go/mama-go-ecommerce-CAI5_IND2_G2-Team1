/* Mama-Go site: shared script.
   EDIT ONLY THE CONFIG BLOCK AND THE PRODUCTS BLOCK BELOW. */
const CONFIG = {
  GTM_ID: 'GTM-XXXXXXX',     // keep as is: GTM is installed with the standard snippet in each page <head> (GTM-KW64GMLZ)
  ORDER_ENDPOINT: "https://script.google.com/macros/s/AKfycbxN_qFw-NtpQm1W5WpGH41ZKdUiO2ZEMmXCGT-XkuBWFDfauVnrHuIGm2EiPjFkOAMc/exec",        // paste your Google Apps Script web app URL here (see apps_script.gs)
  SHIPPING: 40,              // shipping fee in EGP (the yearly package ships free)
  STICKER_PRICE: 50,         // sticker add-on, EGP, per package ordered
  STICKER_COUNT: 32,         // stickers in the add-on pack
};

/* ---------- dataLayer + GTM loader (skipped while GTM_ID is the placeholder) ---------- */
window.dataLayer = window.dataLayer || [];
function track(event, params) {
  window.dataLayer.push(Object.assign({ event: event }, params || {}));
}
(function loadGTM() {
  if (!/^GTM-[A-Z0-9]+$/.test(CONFIG.GTM_ID) || CONFIG.GTM_ID === 'GTM-XXXXXXX') return;
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + CONFIG.GTM_ID;
  document.head.appendChild(s);
})();

/* ---------- catalog: ONE notebook, 3 packages. Update prices here once printing quotes arrive ---------- */
/* img: path of a real product photo, for example 'img/month.jpg'. Leave '' to show the drawn notebook. */
const PRODUCTS = {
  month:   { name: 'دفتر الشهر',  short: 'شهر واحد',  notebooks: 1,  price: 99,  oldPrice: 0,    freeShip: false, tag: '',
             meta: 'دفتر واحد | A5 | 64 صفحة | شهر كامل', desc: 'دفتر واحد يغطي شهر كامل.', img: '' },
  quarter: { name: 'باقة 3 شهور', short: '3 شهور',    notebooks: 3,  price: 250, oldPrice: 297,  freeShip: false, tag: 'وفّري 47 جنيه',
             meta: '3 دفاتر | A5 | 192 صفحة | 3 شهور', desc: '3 دفاتر لـ 3 شهور.', img: '' },
  year:    { name: 'باقة السنة',  short: 'سنة كاملة', notebooks: 12, price: 999, oldPrice: 1188, freeShip: true,  tag: 'وفّري 189 جنيه + شحن مجاني',
             meta: '12 دفتر | A5 | 768 صفحة | سنة كاملة', desc: '12 دفتر، دفتر لكل شهر، وشحن مجاني.', img: '' },
};
const STICKER_IMG = 'img/sticker-time-for-me.jpg'; // used in the checkout summary
const GOVERNORATES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الشرقية', 'الدقهلية', 'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد', 'مطروح', 'شمال سيناء', 'جنوب سيناء'];

/* ---------- inline SVG art (original drawings, mood board colors) ---------- */
var _id = 0;
function nb(x, y, w, h, base, label, rot, big) {
  var id = 'c' + (++_id), r = Math.max(4, w * 0.04), g = '';
  var rings = Math.max(6, Math.round(h / (w * 0.115)));
  for (var i = 0; i < rings; i++) {
    var cy = y + h * 0.05 + i * (h * 0.9 / (rings - 1));
    g += '<ellipse cx="' + x + '" cy="' + cy.toFixed(1) + '" rx="' + (w * 0.065).toFixed(1) + '" ry="' + (w * 0.03).toFixed(1) + '" fill="none" stroke="#C9A24B" stroke-width="' + Math.max(1.2, w * 0.016).toFixed(1) + '"/>';
  }
  var s = '<g' + (rot ? ' transform="rotate(' + rot + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')"' : '') + '>' +
    '<clipPath id="' + id + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '"/></clipPath>' +
    '<rect x="' + (x + 2) + '" y="' + (y + 4) + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="rgba(107,81,71,.22)"/>' +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + base + '"/>' +
    '<g clip-path="url(#' + id + ')">' +
    '<ellipse cx="' + (x + w * 0.78) + '" cy="' + (y + h * 0.1) + '" rx="' + (w * 0.42) + '" ry="' + (h * 0.16) + '" fill="#C6A78D" opacity=".45"/>' +
    '<circle cx="' + (x + w * 0.88) + '" cy="' + (y + h * 0.86) + '" r="' + (w * 0.3) + '" fill="#B9707A" opacity=".38"/>' +
    '<ellipse cx="' + (x + w * 0.2) + '" cy="' + (y + h * 0.9) + '" rx="' + (w * 0.3) + '" ry="' + (h * 0.12) + '" fill="#C6A78D" opacity=".5"/></g>' +
    '<text x="' + (x + w * 0.54) + '" y="' + (y + h * 0.46) + '" text-anchor="middle" font-family="Cairo,Segoe UI,Arial,sans-serif" font-weight="800" font-size="' + (w * 0.17).toFixed(1) + '" fill="#6B5147">Mama Go</text>' +
    (big ? '<text x="' + (x + w * 0.54) + '" y="' + (y + h * 0.55) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="' + (w * 0.036).toFixed(1) + '" letter-spacing="1" fill="#6B5147" opacity=".8">MADE FOR MOM. MADE FOR LIFE.</text>' : '') +
    (label ? '<text x="' + (x + w * 0.54) + '" y="' + (y + h * (big ? 0.7 : 0.62)) + '" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="' + (w * (big ? 0.06 : 0.1)).toFixed(1) + '" letter-spacing="1" fill="#6B5147" opacity=".75">' + label + '</text>' : '') +
    g + '</g>';
  return s;
}
function packageSVG(kind, hue) {
  var bases = ['#E8C9CC', '#B7C3B0', '#E3CDB8'];
  var head = '<svg xmlns="http://www.w3.org/2000/svg" style="direction:ltr" role="img" aria-label="دفتر ماما-جو" ';
  if (kind === 'quarter') {
    return head + 'viewBox="0 0 300 250">' + nb(12, 44, 118, 168, bases[1], 'MONTH 02', -10, false) + nb(172, 44, 118, 168, bases[2], 'MONTH 03', 10, false) + nb(92, 22, 124, 176, bases[0], 'MONTH 01', 0, false) + '</svg>';
  }
  if (kind === 'year') {
    var s = head + 'viewBox="0 0 350 345">';
    for (var i = 0; i < 12; i++) {
      var c = i % 4, rw = Math.floor(i / 4);
      s += nb(20 + c * 86, 8 + rw * 112, 68, 97, bases[i % 3], (i < 9 ? '0' : '') + (i + 1), 0, false);
    }
    return s + '</svg>';
  }
  return head + 'viewBox="0 0 200 250">' + nb(34, 14, 140, 198, bases[hue || 0], 'MONTH 01', 0, true) + '</svg>';
}
function spreadSVG() {
  var days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  var tags = [['#B7C3B0', 46], ['#C6A78D', 30], ['#B9707A', 38], ['#6B5147', 26], ['#E8C9CC', 34]];
  var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 214" style="direction:ltr" role="img" aria-label="صفحتين أسبوع">';
  s += '<rect x="4" y="8" width="332" height="200" rx="10" fill="rgba(107,81,71,.12)"/>';
  s += '<rect x="2" y="2" width="167" height="204" rx="8" fill="#FBF6F0" stroke="#E3D2C5"/><rect x="171" y="2" width="167" height="204" rx="8" fill="#FBF6F0" stroke="#E3D2C5"/>';
  for (var i = 0; i < 7; i++) {
    var left = i < 4, px = left ? 2 : 171, row = left ? i : i - 4, y = 14 + row * 47;
    s += '<text x="' + (px + 158) + '" y="' + (y + 10) + '" text-anchor="end" font-family="Arial, sans-serif" font-size="10" font-weight="700" fill="#6B5147">' + days[i] + '</text>';
    s += '<line x1="' + (px + 10) + '" y1="' + (y + 16) + '" x2="' + (px + 158) + '" y2="' + (y + 16) + '" stroke="#E3D2C5"/>';
    s += '<line x1="' + (px + 10) + '" y1="' + (y + 29) + '" x2="' + (px + 158) + '" y2="' + (y + 29) + '" stroke="#E3D2C5"/>';
    var t = tags[(i * 2) % 5], t2 = tags[(i * 2 + 1) % 5];
    s += '<rect x="' + (px + 158 - t[1]) + '" y="' + (y + 18) + '" width="' + t[1] + '" height="9" rx="3" fill="' + t[0] + '"/>';
    if (i % 2 === 0) s += '<rect x="' + (px + 158 - t2[1]) + '" y="' + (y + 31) + '" width="' + t2[1] + '" height="9" rx="3" fill="' + t2[0] + '"/>';
  }
  s += '<rect x="181" y="156" width="148" height="40" rx="6" fill="#F3E6D8"/>';
  s += '<text x="322" y="171" text-anchor="end" font-family="Arial, sans-serif" font-size="10" font-weight="700" fill="#6B5147">وقت ليكي</text>';
  s += '<circle cx="196" cy="176" r="5" fill="none" stroke="#8A9E85" stroke-width="1.5"/><path d="M193.5 176l2 2 3.5-4" stroke="#8A9E85" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
  return s + '</svg>';
}
function artHTML(kind) {
  var p = PRODUCTS[kind];
  if (p && p.img) return '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">';
  return packageSVG(kind);
}
function renderCatalog() {
  var pc = document.getElementById('productCards');
  if (pc) pc.innerHTML = Object.keys(PRODUCTS).map(function (k) {
    var p = PRODUCTS[k];
    return '<article class="card"><div class="art' + (p.img ? ' has-img' : '') + '" data-art="pkg" data-kind="' + k + '"></div>' +
      (p.tag ? '<span class="tag">' + p.tag + '</span>' : '') +
      '<h3>' + p.name + '</h3><div class="meta">' + p.meta + '</div>' +
      '<div class="price">' + (p.oldPrice ? '<s class="old">' + p.oldPrice + '</s> ' : '') + p.price + ' جنيه</div>' +
      '<a class="btn btn-primary" href="checkout.html?product=' + k + '" data-cta="card_' + k + '">اطلبي الباقة</a></article>';
  }).join('');
}
function renderArt() {
  document.querySelectorAll('[data-art]').forEach(function (el) {
    var type = el.getAttribute('data-art'), kind = el.getAttribute('data-kind') || 'month';
    if (type === 'pkg') el.innerHTML = artHTML(kind);
    if (type === 'cover') el.innerHTML = packageSVG('month', parseInt(el.getAttribute('data-hue') || '0', 10));
    if (type === 'spread') el.innerHTML = spreadSVG();
  });
}

/* ---------- helpers ---------- */
function money(n) { return n.toLocaleString('en-US') + ' جنيه'; }
document.addEventListener('DOMContentLoaded', function () {
  renderCatalog();
  renderArt();
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      track('cta_click', { cta_location: el.getAttribute('data-cta'), cta_text: (el.textContent || '').trim().slice(0, 40) });
    });
  });
});
