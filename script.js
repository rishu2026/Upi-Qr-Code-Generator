document.addEventListener('DOMContentLoaded', () => {
  const merchantName = document.getElementById('merchant-name');
  const upiId = document.getElementById('upi-id');
  const amount = document.getElementById('amount');
  const downloadBtn = document.getElementById('download-btn');
  const qrCodeDiv = document.getElementById('qr-code');
  const displayName = document.getElementById('display-name');
  const displayUpi = document.getElementById('display-upi');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  qrCodeDiv.parentNode.insertBefore(errorDiv, qrCodeDiv);

  let qr;

  function validateInputs() {
    const name = merchantName.value.trim();
    const upi = upiId.value.trim();
    const amt = amount.value.trim();
    
    // Clear previous errors
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    
    // Validate UPI ID
    if (!upi) {
      showError('UPI ID is required');
      return false;
    }
    
    if (!upi.includes('@') || upi.split('@').length !== 2) {
      showError('Please enter a valid UPI ID (must contain @)');
      return false;
    }
    
    // Validate amount if provided
    if (amt) {
      const amountNum = parseFloat(amt);
      if (isNaN(amountNum) || amountNum <= 0) {
        showError('Please enter a valid amount (greater than 0)');
        return false;
      }
    }
    
    return true;
  }

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    qrCodeDiv.innerHTML = '';
    displayName.textContent = "MERCHANT NAME";
    displayUpi.textContent = "merchant@upi";
    downloadBtn.disabled = true;
  }

  function generateQR() {
    if (!validateInputs()) return;

    const name = merchantName.value.trim() || 'MERCHANT';
    const upi = upiId.value.trim();
    const amt = amount.value.trim();

    qrCodeDiv.innerHTML = '';
    downloadBtn.disabled = true;

    try {
      const upiLink = `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}${amt ? `&am=${parseFloat(amt).toFixed(2)}` : ''}`;

      // Clear any previous QR code
      if (qr) {
        qr.clear();
      }

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
    } catch (error) {
      showError('Error generating QR code. Please try again.');
      console.error('QR Generation Error:', error);
    }
  }

  downloadBtn.addEventListener('click', () => {
    const canvas = qrCodeDiv.querySelector('canvas');
    if (!canvas) {
      showError('Please generate a valid QR code first');
      return;
    }

    try {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${displayUpi.textContent.split('@')[0]}_upi_qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      showError('Error downloading QR code. Please try again.');
      console.error('Download Error:', error);
    }
  });

  // Debounce the input events to prevent rapid firing
  let debounceTimer;
  function debounceGenerateQR() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(generateQR, 500);
  }

  [merchantName, upiId, amount].forEach(input => {
    input.addEventListener('input', debounceGenerateQR);
    input.addEventListener('blur', generateQR); // Also generate when leaving the field
  });

  // Initial generation if values are pre-filled
  if (upiId.value.trim()) {
    generateQR();
  }
});
