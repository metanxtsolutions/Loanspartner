/**
 * LoansPartner lead sink: appends every lead to a Google Sheet.
 *
 * This is the second sink that stops Resend being a single point of failure.
 * Email can bounce, rate-limit or silently fail; a spreadsheet row is durable
 * and costs nothing. The site sends to both, and only warns the visitor when
 * neither accepts the lead.
 *
 * ---------------------------------------------------------------------------
 * DEPLOY (about five minutes, all free, no new accounts)
 *
 *  1. Create a new Google Sheet in the account that should own the leads.
 *     Name the first tab exactly: Leads
 *  2. Extensions > Apps Script. Delete the placeholder and paste this file.
 *  3. Edit SHARED_SECRET below to a long random string. Generate one with:
 *       openssl rand -hex 24
 *     Keep it: it goes into Vercel as LEAD_WEBHOOK_SECRET.
 *  4. Deploy > New deployment > type "Web app".
 *       Execute as:        Me
 *       Who has access:    Anyone
 *     "Anyone" is required because Vercel calls this unauthenticated. The URL
 *     is unguessable and SHARED_SECRET is what actually gates writes.
 *  5. Approve the Google authorisation screen. It asks for permission to edit
 *     this spreadsheet, which is what the script does.
 *  6. Copy the deployment URL. It looks like:
 *       https://script.google.com/macros/s/AKfyc.../exec
 *
 *  Then set both on the Vercel project (Settings > Environment Variables,
 *  Production and Preview):
 *       LEAD_WEBHOOK_URL     = the /exec URL
 *       LEAD_WEBHOOK_SECRET  = the same string as SHARED_SECRET
 *  Redeploy so the running functions pick the values up.
 *
 *  Re-deploying the script later: use Deploy > Manage deployments > edit the
 *  existing one and bump the version. Creating a NEW deployment issues a NEW
 *  URL, which would silently stop the site writing here.
 *
 * ---------------------------------------------------------------------------
 * TEST without touching production
 *
 *     curl -X POST "<your /exec URL>" \
 *       -H 'content-type: application/json' \
 *       -d '{"secret":"<SHARED_SECRET>","id":"test-1","leadId":"L1",
 *            "type":"lead.created","at":"2026-01-01T00:00:00.000Z",
 *            "page":"/apply","data":{"name":"Test","phone":"9999999999"}}'
 *
 * A row should appear. Expect {"ok":true}. A wrong secret returns
 * {"ok":false,"error":"unauthorized"} and writes nothing.
 */

// Replace before deploying. Must match LEAD_WEBHOOK_SECRET on Vercel.
var SHARED_SECRET = "CHANGE_ME_BEFORE_DEPLOYING";

var SHEET_NAME = "Leads";

var HEADERS = [
  "received_at",
  "event_type",
  "lead_id",
  "name",
  "phone",
  "email",
  "city",
  "product",
  "amount",
  "employment",
  "cibil",
  "page",
  "event_id",
  "event_at",
  "all_fields",
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: "empty body" });
    }

    var payload = JSON.parse(e.postData.contents);

    // Constant-time-ish comparison is overkill here, but do reject early and
    // never echo the expected value back in the response.
    if (!SHARED_SECRET || payload.secret !== SHARED_SECRET) {
      return json({ ok: false, error: "unauthorized" });
    }

    var data = payload.data || {};
    var sheet = getSheet();

    sheet.appendRow([
      new Date(),
      payload.type || "",
      payload.leadId || "",
      str(data.name),
      // Leading apostrophe keeps a 10-digit Indian mobile from being read as a
      // number, which would drop a leading zero and strip any +91.
      data.phone ? "'" + str(data.phone) : "",
      str(data.email),
      str(data.city),
      str(data.product),
      str(data.amount),
      str(data.employment),
      str(data.cibil),
      payload.page || "",
      payload.id || "",
      payload.at || "",
      JSON.stringify(data),
    ]);

    return json({ ok: true });
  } catch (err) {
    // Returning 200 with ok:false would make the site think the lead landed.
    // Throwing gives a non-2xx, which the site retries once and then logs as
    // UNDELIVERED, so nothing is lost silently.
    throw err;
  }
}

function doGet() {
  // A browser hitting the URL should not look like a broken deployment.
  return json({ ok: true, service: "loanspartner lead sink" });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function str(v) {
  if (v === null || v === undefined) return "";
  if (Object.prototype.toString.call(v) === "[object Array]") return v.join(", ");
  return String(v);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
