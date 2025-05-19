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

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 700;
            canvas.height = 800;

            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Merchant Name
            ctx.font = 'bold 36px Arial';
            ctx.fillStyle = '#1e1e1e';
            ctx.textAlign = 'center';
            ctx.fillText(displayName.textContent, canvas.width / 2, 60);

            // QR Code
            ctx.drawImage(qrCanvas, 200, 90, 300, 300);

            // UPI ID
            ctx.font = 'bold 26px Arial';
            ctx.fillStyle = '#333333';
            ctx.fillText(displayUpi.textContent, canvas.width / 2, 420);

            // Instruction
            ctx.font = '18px Arial';
            ctx.fillStyle = '#666666';
            ctx.fillText('Scan and pay using any UPI app', canvas.width / 2, 460);

            // App Icons (color blocks with labels)
            const icons = [
                { text: 'GPay', color: '#4285F4' },
                { text: 'PhonePe', color: '#5f259f' },
                { text: 'Paytm', color: '#0033cc' },
                { text: 'Amazon Pay', color: '#ff9900' }
            ];
            const startX = 70;
            const y = 500;
            const iconW = 130, iconH = 50;
            const gap = 30;

            icons.forEach((icon, i) => {
                const x = startX + i * (iconW + gap);
                ctx.fillStyle = icon.color;
                ctx.roundRect(x, y, iconW, iconH, 10);
                ctx.fill();

                ctx.font = 'bold 18px Arial';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(icon.text, x + iconW / 2, y + 32);
            });

            // Radhe Radhe
            ctx.font = 'bold 26px Arial';
            ctx.fillStyle = '#ff4d4d';
            ctx.fillText('🙏 Radhe Radhe 🙏', canvas.width / 2, 700);

            // Download Image
            const upiPart = displayUpi.textContent.split('@')[0];
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${upiPart}_cleanQR.png`;
            link.click();
        } catch (err) {
            alert('Download failed.');
            console.error(err);
        }
    });

    // Draw rounded rectangles (helper)
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };

    [merchantName, upiId, amount].forEach(input => {
        input.addEventListener('input', generateQR);
    });
});
