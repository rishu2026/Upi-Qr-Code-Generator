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
            tempCanvas.height = 780;

            // Background
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Header
            tempCtx.fillStyle = '#e3f2fd';
            tempCtx.fillRect(0, 0, 600, 70);

            // Merchant Name
            tempCtx.fillStyle = '#1a237e';
            tempCtx.font = 'bold 28px Arial';
            tempCtx.textAlign = 'center';
            tempCtx.fillText('MERCHANT  NAME', tempCanvas.width / 2, 45);

            // QR Code
            tempCtx.drawImage(qrCanvas, 150, 90, 300, 300);

            // UPI ID
            tempCtx.fillStyle = '#424242';
            tempCtx.font = '20px Arial';
            tempCtx.fillText(displayUpi.textContent, tempCanvas.width / 2, 420);

            // Instruction
            tempCtx.fillStyle = '#000000';
            tempCtx.font = '18px Arial';
            tempCtx.fillText('Scan and pay with any BHIM UPI app', tempCanvas.width / 2, 460);

            // BHIM / UPI Logo (colored text)
            tempCtx.font = 'bold 22px Arial';
            tempCtx.fillStyle = '#ff6f00'; // BHIM orange
            tempCtx.fillText('BHIM', 270, 495);
            tempCtx.fillStyle = '#43a047'; // UPI green
            tempCtx.fillText('UPI', 330, 495);

            // Colored app boxes
            const icons = [
                { name: 'GPay', color: '#4285F4' },
                { name: 'PhonePe', color: '#673AB7' },
                { name: 'Paytm', color: '#0033cc' },
                { name: 'Amazon Pay', color: '#ff9900' }
            ];

            const startX = 30;
            const iconY = 540;
            const iconWidth = 120;
            const iconHeight = 50;
            const spacing = 30;

            icons.forEach((icon, index) => {
                const x = startX + index * (iconWidth + spacing);
                tempCtx.fillStyle = icon.color;
                tempCtx.fillRect(x, iconY, iconWidth, iconHeight);

                tempCtx.fillStyle = '#fff';
                tempCtx.font = 'bold 16px Arial';
                tempCtx.textAlign = 'center';
                tempCtx.textBaseline = 'middle';
                tempCtx.fillText(icon.name, x + iconWidth / 2, iconY + iconHeight / 2);
            });

            // Footer
            tempCtx.fillStyle = '#d32f2f';
            tempCtx.font = 'bold 20px Arial';
            tempCtx.fillText('🙏 Radhe Radhe 🙏', tempCanvas.width / 2, 730);

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
