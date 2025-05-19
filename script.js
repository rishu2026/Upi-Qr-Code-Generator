document.addEventListener('DOMContentLoaded', () => {
  const merchantName = document.getElementById('merchant-name');
  const upiId = document.getElementById('upi-id');
  const amount = document.getElementById('amount');
  const downloadBtn = document.getElementById('download-btn');
  const qrCodeDiv = document.getElementById('qr-code');
  const displayName = document.getElementById('display-name');
  const displayUpi = document.getElementById('display-upi');

  let qr;

  function generateQR() {
    const name = merchantName.value.trim() || 'MERCHANT';
    const upi = upiId.value.trim();
    const amt = amount.value.trim();

    qrCodeDiv.innerHTML = '';
    downloadBtn.disabled = true;

    if (!upi || !upi.includes('@')) {
      qrCodeDiv.innerHTML = '<div class="hint" style="color:red;">Enter valid UPI ID</div>';
      displayName.textContent = "MERCHANT NAME";
      displayUpi.textContent = "merchant@upi";
      return;
    }

    const upiLink = `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}${amt ? `&am=${parseFloat(amt).toFixed(2)}` : ''}`;

    const qrCanvas = document.createElement('div');
    qrCodeDiv.appendChild(qrCanvas);
    qr = new QRCode(qrCanvas, {
      text: upiLink,
      width: 300,
      height: 300,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    displayName.textContent = name.toUpperCase();
    displayUpi.textContent = upi;
    downloadBtn.disabled = false;
  }

  downloadBtn.addEventListener('click', () => {
    const canvas = qrCodeDiv.querySelector('canvas');
    if (!canvas) return alert("Please generate QR first");

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${displayUpi.textContent.split('@')[0]}_upi_qr.png`;
    link.click();
  });

  [merchantName, upiId, amount].forEach(input => {
    input.addEventListener('input', () => {
      setTimeout(generateQR, 300);
    });
  });
});
