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
            if (!qrCanvas) {
                throw new Error('Please generate a QR code first');
            }

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = 600;
            tempCanvas.height = 650;

            // Background
            tempCtx.fillStyle = 'white';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Merchant name
            tempCtx.fillStyle = '#222';
            tempCtx.font = 'bold 28px Arial';
            tempCtx.textAlign = 'center';
            tempCtx.fillText(displayName.textContent, tempCanvas.width / 2, 60);

            // UPI ID
            tempCtx.fillStyle = '#555';
            tempCtx.font = '20px Arial';
            tempCtx.fillText(displayUpi.textContent, tempCanvas.width / 2, 100);

            // QR code
            tempCtx.drawImage(qrCanvas, 200, 120, 200, 200);

            // Instruction
            tempCtx.fillStyle = '#000';
            tempCtx.font = '18px Arial';
            tempCtx.fillText('Scan and pay with any BHIM UPI app', tempCanvas.width / 2, 350);

            // Icons for GPay, PhonePe, Paytm, Amazon Pay (fake, drawn as rectangles)
            const icons = ['GPay', 'PhonePe', 'Paytm', 'Amazon Pay'];
            const startX = 30;
            const iconY = 400;
            const iconWidth = 120;
            const iconHeight = 50;
            const spacing = 30;

            icons.forEach((icon, index) => {
                const x = startX + index * (iconWidth + spacing);
                tempCtx.fillStyle = '#f2f2f2';
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
            tempCtx.fillText('Create your own UPI QR code at yoursite.com', tempCanvas.width / 2, 620);

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
