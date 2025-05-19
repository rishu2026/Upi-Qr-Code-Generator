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
                width: 300,  // Increased size
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

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 600;
            canvas.height = 700;

            // Background
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Merchant Name
            ctx.font = 'bold 32px Orbitron';
            ctx.fillStyle = '#00ffff';
            ctx.textAlign = 'center';
            ctx.fillText(displayName.textContent, canvas.width / 2, 60);

            // QR Code (Larger with clear squares)
            ctx.drawImage(qrCanvas, 150, 80, 300, 300);

            // UPI ID - Bigger & clearer
            ctx.font = 'bold 22px Orbitron';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(displayUpi.textContent, canvas.width / 2, 410);

            // Instruction
            ctx.font = '16px Arial';
            ctx.fillStyle = '#aaaaaa';
            ctx.fillText('Scan and pay with any BHIM UPI app', canvas.width / 2, 440);

            // UPI Icons
            const icons = [
                { text: 'GPay', color: '#4285F4' },
                { text: 'PhonePe', color: '#5f259f' },
                { text: 'Paytm', color: '#0033cc' },
                { text: 'Amazon Pay', color: '#ff9900' }
            ];
            const startX = 50;
            const y = 470;
            const iconW = 120, iconH = 50;
            const gap = 20;

            icons.forEach((icon, i) => {
                const x = startX + i * (iconW + gap);
                ctx.fillStyle = icon.color;
                ctx.fillRect(x, y, iconW, iconH);

                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText(icon.text, x + iconW / 2, y + 32);
            });

            // Radhe Radhe
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#ff4d4d';
            ctx.fillText('🙏 Radhe Radhe 🙏', canvas.width / 2, 640);

            // Download
            const upiPart = displayUpi.textContent.split('@')[0];
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${upiPart}_bigQR.png`;
            link.click();
        } catch (err) {
            alert('Download failed.');
            console.error(err);
        }
    });

    [merchantName, upiId, amount].forEach(input => {
        input.addEventListener('input', generateQR);
    });
});
