
    // invoice.js - Updated and organized version

// ========== PRODUCT DATA ==========
const productData = {

      "AGED OAK AC HF001585": { rate: 62.5, sqft: 30, gst: 18 },
      "BRUNETTE WOOD AC HF001581": { rate: 62.5, sqft: 30, gst: 18 },
      "DARK WALNUT AC HF001584": { rate: 62.5, sqft: 30, gst: 18 },
      "EVENING BARLEY AC HF001582": { rate: 62.5, sqft: 30, gst: 18 },
      "HARBOUR GREY AC HF001589": { rate: 62.5, sqft: 30, gst: 18 },
      "JAVA WOOD AC HF001587": { rate: 62.5, sqft: 30, gst: 18 },
      "SERENITY AC HF001588": { rate: 62.5, sqft: 30, gst: 18 },
      "SUN BAKED OAK AC HF001583": { rate: 62.5, sqft: 30, gst: 18 },
      "TAWNY HICKORY AC HF001586": { rate: 62.5, sqft: 30, gst: 18 },
      "WHISKER OAK AC HF001578": { rate: 62.5, sqft: 30, gst: 18 },
      "YELLOW CLAY AC HF001580": { rate: 62.5, sqft: 30, gst: 18 },
      "CINNAMON AC HF001579": { rate: 62.5, sqft: 30, gst: 18 },
      "CTY00300": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00299": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00293": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00286": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00284": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00282": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00280": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00279": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00278": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00277": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00273": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00266": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00265": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00263": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00262": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00261": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00259": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00258": { rate: 75, sqft: 53.82, gst: 12 },
      "CTY00254": { rate: 70, sqft: 53.82, gst: 12 },
      "CTY00249": { rate: 70, sqft: 53.82, gst: 12 },
      "CTY00232": { rate: 70, sqft: 53.82, gst: 12 },
      "CTY00230": { rate: 70, sqft: 53.82, gst: 12 },
      "CTY00229": { rate: 70, sqft: 53.82, gst: 12 },
      "CTY00220": { rate: 70, sqft: 53.82, gst: 12 },
      "CTY00215": { rate: 80, sqft: 53.82, gst: 12 },
      "CTY00214": { rate: 80, sqft: 53.82, gst: 12 },
      "CTY00203": { rate: 85, sqft: 53.82, gst: 12 },
      "CTY00204": { rate: 85, sqft: 53.82, gst: 12 },
      "CTY00206": { rate: 85, sqft: 53.82, gst: 12 },
      "CTY00208": { rate: 85, sqft: 53.82, gst: 12 },
      "CTY00211": { rate: 85, sqft: 53.82, gst: 12 },
      "CTY0021O": { rate: 85, sqft: 53.82, gst: 12 },
      "CTY00216": { rate: 85, sqft: 53.82, gst: 12 },
      "CTY00217": { rate: 85, sqft: 53.82, gst: 12 }
    };
  // ... (truncated for brevity, all your productData goes here)

// ========== INITIALIZE INVOICE ==========
function getNextInvoiceNumber() {
  let num = parseInt(localStorage.getItem('lastInvoiceNo') || "0", 10);
  num += 1;
  localStorage.setItem('lastInvoiceNo', num);
  return 'PI' + num.toString().padStart(3, '0');
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('invoiceNo').value = getNextInvoiceNumber();
  document.getElementById('invoiceDate').valueAsDate = new Date();
});

// ========== ROW HANDLING ==========
function addRow() {
  const tbody = document.getElementById('productBody');
  if (!tbody) return console.error('Missing #productBody');

  try {
    const row = document.createElement('tr');
    const options = Object.keys(productData).map(p => `<option value="${p}">${p}</option>`).join('');
    row.innerHTML = `
      <td><select onchange="updateRow(this)"><option value="">Select product</option>${options}</select></td>
      <td><input type="number" class="rate" oninput="recalc(this)" min="0" step="0.01"></td>
      <td><input type="number" class="boxes" oninput="recalc(this)" min="0" step="1"></td>
      <td><input type="number" class="totalSqft" readonly></td>
      <td><input type="text" class="gst" readonly></td>
      <td><input type="number" class="amount" readonly></td>
    `;
    tbody.appendChild(row);
  } catch (error) {
    console.error('Error adding row:', error);
  }
}

function updateRow(select) {
  const row = select.closest('tr');
  const data = productData[select.value];
  if (!data) return;
  row.querySelector('.rate').value = data.rate;
  row.dataset.sqftPerBox = data.sqft;
  row.dataset.gst = data.gst;
  row.querySelector('.gst').value = data.gst + '%';
  recalc(select);
}

function recalc(input) {
  const row = input.closest('tr');
  const rate = parseFloat(row.querySelector('.rate').value) || 0;
  const boxes = parseFloat(row.querySelector('.boxes').value) || 0;
  const sqft = parseFloat(row.dataset.sqftPerBox) || 0;
  const gst = parseFloat(row.dataset.gst) || 0;

  const totalSqft = boxes * sqft;
  const baseAmount = totalSqft * rate;
  const gstAmount = baseAmount * gst / 100;
  const totalAmount = baseAmount + gstAmount;

  row.querySelector('.totalSqft').value = totalSqft.toFixed(2);
  row.querySelector('.amount').value = totalAmount.toFixed(2);
  row.dataset.gstAmount = gstAmount.toFixed(2);

  calculateTotal();
}

function calculateTotal() {
  let total = 0, gstTotal = 0;
  document.querySelectorAll('#productBody tr').forEach(row => {
    total += parseFloat(row.querySelector('.amount').value) || 0;
    gstTotal += parseFloat(row.dataset.gstAmount) || 0;
  });

  const freight = parseFloat(document.getElementById("deliveryCharge").value || 0);
  const freightGST = freight * 0.18;
  const freightTotal = freight + freightGST;

  document.getElementById("grandTotal").innerText = total.toFixed(2);
  document.getElementById("deliveryAmount").innerText = freightTotal.toFixed(2);
  document.getElementById("gstAmount").innerText = (gstTotal + freightGST).toFixed(2);
  document.getElementById("finalAmount").innerText = (total + freightTotal).toFixed(2);
  document.getElementById("deliveryLine").style.display = freight > 0 ? "table-row" : "none";
}

// ========== GOOGLE DRIVE ==========
const CLIENT_ID = '68542936063-jn0q2f3c9o47gtk0716jbqqlrrh5t8n6.apps.googleusercontent.com';
const SCOPES = "https://www.googleapis.com/auth/drive.file";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

function gapiLoaded() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({ clientId: CLIENT_ID, discoveryDocs: DISCOVERY_DOCS, scope: SCOPES })
    .then(() => document.getElementById('uploadToDrive').disabled = false);
}

async function authenticate() {
  const auth = gapi.auth2.getAuthInstance();
  if (!auth.isSignedIn.get()) await auth.signIn();
}

async function getOrCreateFolder(folderName) {
  const resp = await gapi.client.drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName}'`,
    fields: 'files(id,name)'
  });
  if (resp.result.files.length) return resp.result.files[0].id;

  const create = await gapi.client.drive.files.create({
    resource: { name: folderName, mimeType: 'application/vnd.google-apps.folder' },
    fields: 'id'
  });
  return create.result.id;
}

function generatePDFBlob() {
  return html2canvas(document.body, { scale: 2 }).then(canvas => {
    const img = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF({ unit: 'pt', format: 'a4' });
    const w = pdf.internal.pageSize.getWidth();
    const h = canvas.height * w / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    return pdf.output('blob');
  });
}

async function uploadPdfToDrive(pdfBlob, filename, folderId) {
  const boundary = 'foo_bar_baz';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;
  const metadata = { name: filename, mimeType: 'application/pdf', parents: [folderId] };

  const fileData = await new Promise(res => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsBinaryString(pdfBlob);
  });
  const base64data = btoa(fileData);

  const multipartRequestBody =
    delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter + 'Content-Type: application/pdf\r\nContent-Transfer-Encoding: base64\r\n\r\n' +
    base64data + closeDelim;

  const resp = await gapi.client.request({
    path: '/upload/drive/v3/files',
    method: 'POST',
    params: { uploadType: 'multipart' },
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body: multipartRequestBody
  });
  return resp.result;
}

function loadGapi() {
  const s = document.createElement('script');
  s.src = 'https://apis.google.com/js/api.js?onload=gapiLoaded';
  s.async = true;
  document.body.appendChild(s);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGapi);
} else {
  loadGapi();
}

// ========== FINALIZE UPLOAD ==========
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('uploadToDrive')?.addEventListener('click', async function () {
    this.disabled = true;
    try {
      await authenticate();
      const folderId = await getOrCreateFolder(getMonthFolderName());
      const filename = `${getInvoiceFilename()}.pdf`;
      const pdfBlob = await generatePDFBlob();
      await uploadPdfToDrive(pdfBlob, filename, folderId);
      alert(`✅ Uploaded: ${filename}`);
    } catch (e) {
      alert(`❌ Upload failed: ${e.message}`);
      console.error(e);
    }
    this.disabled = false;
  });
});

// ========== HELPERS ==========
function getInvoiceFilename() {
  const invoiceNo = document.getElementById('invoiceNo').value.replace(/[^\w]/g, '');
  const buyer = (document.getElementById('buyerName').value || 'Buyer').split('\n')[0].replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  const date = new Date(document.getElementById('invoiceDate').value || Date.now());
  return `${invoiceNo}-${buyer}-${date.toISOString().slice(2, 10).replace(/-/g, '/')}`;
}

function getMonthFolderName() {
  const d = new Date(document.getElementById('invoiceDate').value || Date.now());
  return `Shakuntalam Pi ${d.toLocaleString('default', { month: 'long' })}`;
}

let pendingBlob = null;

    function generateInvoice() {
      // Simulate PDF generation using Blob
      const content = 'Invoice Data: ' + new Date().toLocaleString();
      const blob = new Blob([content], { type: 'application/pdf' });
      previewPDF(blob);

      if (!navigator.onLine) {
        pendingBlob = blob;
        localStorage.setItem('pendingInvoice', content);
        document.getElementById('offlineNotice').style.display = 'block';
      } else {
        uploadPDF(blob);
      }
    }

    function previewPDF(blob) {
      const url = URL.createObjectURL(blob);
      document.getElementById('pdfPreview').src = url;
      document.querySelector('.preview-box').style.display = 'block';
    }

    function uploadPDF(blob) {
      alert('Uploading invoice...');
      // Replace this with actual Google Drive upload logic
      document.getElementById('offlineNotice').style.display = 'none';
      document.querySelector('.preview-box').style.display = 'none';
    }

    function uploadWhenOnline() {
      if (pendingBlob && navigator.onLine) {
        uploadPDF(pendingBlob);
    window.addEventListener('online', () => {
      const savedContent = localStorage.getItem('pendingInvoice');
      if (savedContent) {
        const blob = new Blob([savedContent], { type: 'application/pdf' });
        previewPDF(blob);
        pendingBlob = blob;
      }
    });    pendingBlob = null;
        localStorage.removeItem('pendingInvoice');
      } else {
        alert('Still offline. Try again later.');
      }
    }

    
