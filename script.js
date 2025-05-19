document.addEventListener('DOMContentLoaded', () => {
    const merchantName = document.getElementById('merchant-name');
    const upiId = document.getElementById('upi-id');
    const amount = document.getElementById('amount');
    const downloadBtn = document.getElementById('download-btn');
    const qrCodeDiv = document.getElementById('qr-code');
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

            // Create a container for the QR code and additional elements
            const qrContainer = document.createElement('div');
            qrContainer.id = 'qr-container';

            // Merchant Name
            const merchantNameDisplay = document.createElement('div');
            merchantNameDisplay.id = 'merchant-name-display';
            merchantNameDisplay.textContent = name.toUpperCase();
            qrContainer.appendChild(merchantNameDisplay);

            // QR Code
            const qrCanvas = document.createElement('div');
            qrContainer.appendChild(qrCanvas);

            // Clear any previous QR code
            if (qr) {
                qr.clear();
            }

            qr = new QRCode(qrCanvas, {
                text: upiLink,
                width: 300,
                height: 300,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // UPI ID
            const upiIdDisplay = document.createElement('div');
            upiIdDisplay.id = 'upi-id-display';
            upiIdDisplay.textContent = upi;
            qrContainer.appendChild(upiIdDisplay);

            // Scan and Pay Message
            const scanMessage = document.createElement('div');
            scanMessage.id = 'scan-message';
            scanMessage.textContent = 'Scan and pay with any BHIM UPI app';
            qrContainer.appendChild(scanMessage);

            // Logos
            const logosDiv = document.createElement('div');
            logosDiv.id = 'logos';
            const logoUrls = [
                'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/BHIM_Logo.png/120px-BHIM_Logo.png',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/UPI_Logo_vector.svg/120px-UPI_Logo_vector.svg.png',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Google_Pay_Logo.svg/120px-Google_Pay_Logo.svg.png',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/PhonePe_Logo.svg/120px-PhonePe_Logo.svg.png',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Paytm_Logo_%28standalone%29.svg/120px-Paytm_Logo_%28standalone%29.svg.png',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Amazon_Pay_logo.svg/120px-Amazon_Pay_logo.svg.png'
            ];

            logoUrls.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.alt = 'Payment App Logo';
                logosDiv.appendChild(img);
            });
            qrContainer.appendChild(logosDiv);

            // Footer Link
            const footerLink = document.createElement('div');
            footerLink.id = 'footer-link';
            footerLink.textContent = 'Create your own UPI QR code at www.labnol.org/upi';
            qrContainer.appendChild(footerLink);

            // Append the container to the DOM
            qrCodeDiv.appendChild(qrContainer);

            downloadBtn.disabled = false;
        } catch (error) {
            showError('Error generating QR code. Please try again.');
            console.error('QR Generation Error:', error);
        }
    }

    downloadBtn.addEventListener('click', () => {
        const qrContainer = document.getElementById('qr-container');
        if (!qrContainer) {
            showError('Please generate a valid QR code first');
            return;
        }

        try {
            // Use html2canvas to capture the entire container
            html2canvas(qrContainer).then(canvas => {
                const image = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = image;
                link.download = `${upiId.value.split('@')[0]}_upi_qr.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
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
        input.addEventListener('blur', generateQR);
    });

    // Initial generation if values are pre-filled
    if (upiId.value.trim()) {
        generateQR();
    }
});
