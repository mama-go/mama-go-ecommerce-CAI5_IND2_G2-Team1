/* Mama-Go: receives an order, saves it as a new row in a Google Sheet, emails the customer, and emails YOU.
   SETUP (5 minutes):
   1. Create a Google Sheet (name it "Mama-Go Orders").
   2. In the Sheet: Extensions > Apps Script. Delete the sample code, paste this whole file.
   3. Put your email in OWNER_EMAIL below.
   4. Click Deploy > New deployment > type "Web app". Execute as: Me. Who has access: Anyone. Deploy and allow the permissions.
   5. Copy the Web app URL and paste it in app.js, CONFIG.ORDER_ENDPOINT. Upload app.js again.
   After any change to this code, use Deploy > Manage deployments > edit > New version. */
var OWNER_EMAIL = '';   // example: 'you@gmail.com'. Leave empty to skip the owner email.

function doPost(e) {
  try {
    var o = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Time','Order ID','Status','Name','Phone','Email','Governorate','City','Address','Package','Notebooks','Qty','Stickers','Shipping EGP','Total EGP','Payment','Source','Medium','Campaign','Notes']);
      sh.setFrozenRows(1);
    }
    sh.appendRow([o.created_at,o.order_id,'New',o.name,o.phone,o.email,o.governorate,o.city,o.address,o.product,o.notebooks,o.qty,o.stickers?'yes':'no',o.shipping,o.total,o.payment_method,o.source,o.medium,o.campaign,o.notes]);

    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email || '')) {
      var html = '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;max-width:520px;margin:auto;color:#6B5147;line-height:1.8">' +
        '<h2 style="color:#A15A66">شكرًا ليكي يا ' + esc((o.name || '').split(' ')[0]) + '!</h2>' +
        '<p>استلمنا طلبك رقم <b>' + esc(o.order_id) + '</b>.</p>' +
        '<table style="width:100%;border-collapse:collapse">' +
        '<tr><td>الباقة</td><td><b>' + esc(o.product) + '</b></td></tr>' +
        '<tr><td>عدد الدفاتر</td><td>' + esc(o.notebooks) + '</td></tr>' +
        '<tr><td>ستيكرز (32 ستيكر)</td><td>' + (o.stickers ? 'مضافة' : 'من غير') + '</td></tr>' +
        '<tr><td>الكمية</td><td>' + esc(o.qty) + '</td></tr>' +
        '<tr><td>الإجمالي كاش عند الاستلام</td><td><b>' + esc(o.total) + ' جنيه</b></td></tr></table>' +
        '<p style="color:#7A6459;font-size:13px">هنكلمك على الموبايل نأكد العنوان والتفاصيل.</p></div>';
      MailApp.sendEmail({ to: o.email, subject: 'تأكيد طلبك من ماما-جو ' + o.order_id, htmlBody: html, name: 'Mama-Go' });
    }
    if (OWNER_EMAIL) {
      MailApp.sendEmail({ to: OWNER_EMAIL, subject: 'طلب جديد ' + o.order_id + ' | ' + o.total + ' جنيه',
        body: 'طلب جديد من الموقع\n' + o.product + ' x ' + o.qty + (o.stickers ? ' + ستيكرز' : '') + '\nالإجمالي: ' + o.total + ' جنيه (كاش)\n' +
              o.name + ' | ' + o.phone + '\n' + o.governorate + ' ' + o.city + ' ' + o.address + '\nالمصدر: ' + (o.source || 'مباشر') });
    }
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}
