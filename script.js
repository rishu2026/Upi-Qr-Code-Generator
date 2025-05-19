document.addEventListener('DOMContentLoaded', function () {
    const merchantName = document.getElementById('merchant-name');
    const upiId = document.getElementById('upi-id');
    const amount = document.getElementById('amount');
    const downloadBtn = document.getElementById('download-btn');
    const qrCodeDiv = document.getElementById('qr-code');
    const displayName = document.getElementById('display-name');
    const displayUpi = document.getElementById('display-upi');

    let qrCode = null;

    function generateQR() {
        const name = merchantName.value.trim() || "MERCHANT";
        const upi = upiId.value.trim();
        const amt = amount.value.trim();

        qrCodeDiv.innerHTML = '';
        downloadBtn.disabled = true;

        if (!upi) {
            qrCodeDiv.innerHTML = '<div class="hint"><i class="fas fa-qrcode"></i> Enter UPI ID</div>';
            displayName.textContent = "MERCHANT NAME";
            displayUpi.textContent = "merchant@upi";
            return;
        }

        let upiLink = `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}`;
        if (amt) upiLink += `&am=${parseFloat(amt).toFixed(2)}`;

        try {
            qrCode = new QRCode(qrCodeDiv, {
                text: upiLink,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            displayName.textContent = name.toUpperCase();
            displayUpi.textContent = upi;
            downloadBtn.disabled = false;
        } catch (error) {
            console.error("QR Generation Error:", error);
            qrCodeDiv.innerHTML = '<div class="hint" style="color:red">Error generating QR</div>';
        }
    }

    downloadBtn.addEventListener('click', function () {
    try {
        const qrCanvas = document.querySelector('#qr-code canvas');
        if (!qrCanvas) throw new Error('Please generate a QR code first');

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 600;
        tempCanvas.height = 850;

        // White background
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Top rounded rectangle
        tempCtx.fillStyle = '#f1f3f6';
        tempCtx.fillRect(0, 0, 600, 80);

        // Merchant Title
        tempCtx.fillStyle = '#333';
        tempCtx.font = 'bold 24px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.fillText('MERCHANT  NAME', tempCanvas.width / 2, 50);

        // QR Code
        tempCtx.drawImage(qrCanvas, 200, 100, 200, 200);

        // Display UPI ID
        tempCtx.fillStyle = '#444';
        tempCtx.font = '18px Arial';
        tempCtx.fillText(displayUpi.textContent, tempCanvas.width / 2, 330);

        // Instruction
        tempCtx.fillStyle = '#000';
        tempCtx.font = '16px Arial';
        tempCtx.fillText('Scan and pay with any BHIM UPI app', tempCanvas.width / 2, 370);

        // BHIM/UPI Logos (text placeholders for simplicity)
        tempCtx.font = 'bold 20px Arial';
        tempCtx.fillStyle = '#000';
        tempCtx.fillText('BHIM', 260, 410);
        tempCtx.fillText('UPI', 340, 410);

        // Payment App Logos (GPay, PhonePe, Paytm, Amazon Pay)
        const icons = ['G Pay', 'PhonePe', 'Paytm', 'Amazon Pay'];
        const startX = 30;
        const iconY = 460;
        const iconWidth = 120;
        const iconHeight = 50;
        const spacing = 30;

        icons.forEach((icon, index) => {
            const x = startX + index * (iconWidth + spacing);
            tempCtx.fillStyle = '#e0e0e0';
            tempCtx.fillRect(x, iconY, iconWidth, iconHeight);

            tempCtx.fillStyle = '#333';
            tempCtx.font = 'bold 16px Arial';
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.fillText(icon, x + iconWidth / 2, iconY + iconHeight / 2);
        });

        // Footer
        tempCtx.fillStyle = '#888';
        tempCtx.font = '14px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.fillText('Create your own UPI QR code at www.labnol.org/upi', tempCanvas.width / 2, 820);

        // Download logic
        const upiPart = displayUpi.textContent.split('@')[0];
        const link = document.createElement('a');
        link.href = tempCanvas.toDataURL('image/png');
        link.download = `${upiPart}.png`;
        link.click();
    } catch (error) {
        console.error("Download Error:", error);
        alert('Download failed. Please try again in Chrome/Firefox.');
    }
});


    [merchantName, upiId, amount].forEach(input => {
        input.addEventListener('input', generateQR);
    });
});
