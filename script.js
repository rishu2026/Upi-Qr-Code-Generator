<script>
document.addEventListener('DOMContentLoaded', function () {
    const merchantName = document.getElementById('merchant-name');
    const upiId = document.getElementById('upi-id');
    const amount = document.getElementById('amount');
    const downloadBtn = document.getElementById('download-btn');
    const qrCodeDiv = document.getElementById('qr-code');
    const displayName = document.getElementById('display-name');
    const displayUpi = document.getElementById('display-upi');

    let qrCode = null;
    let qrCanvas = null; // Store reference to QR canvas

    function generateQR() {
        const name = merchantName.value.trim() || "MERCHANT";
        const upi = upiId.value.trim();
        const amt = amount.value.trim();

        qrCodeDiv.innerHTML = '';
        downloadBtn.disabled = true;
        qrCanvas = null; // Reset canvas reference

        if (!upi) {
            qrCodeDiv.innerHTML = '<div class="hint"><i class="fas fa-qrcode"></i> Enter UPI ID</div>';
            displayName.textContent = "MERCHANT NAME";
            displayUpi.textContent = "merchant@upi";
            return;
        }

        let upiLink = `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}`;
        if (amt) upiLink += `&am=${parseFloat(amt).toFixed(2)}`;

        try {
            qrCodeDiv.innerHTML = '<canvas id="qr-canvas"></canvas>'; // Create canvas with ID
            qrCode = new QRCode(document.getElementById('qr-canvas'), {
                text: upiLink,
                width: 350,
                height: 350,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Store reference to the canvas after generation
            setTimeout(() => {
                qrCanvas = document.getElementById('qr-canvas');
                displayName.textContent = name.toUpperCase();
                displayUpi.textContent = upi;
                downloadBtn.disabled = false;
            }, 100); // Small delay to ensure QR code is rendered
        } catch (error) {
            console.error("QR Generation Error:", error);
            qrCodeDiv.innerHTML = '<div class="hint" style="color:red">Error generating QR</div>';
        }
    }

    downloadBtn.addEventListener('click', function () {
        try {
            if (!qrCanvas) {
                throw new Error('Please generate a QR code first');
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 700;
            canvas.height = 900;

            // Light background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Merchant Name
            ctx.font = 'bold 36px Orbitron, Arial, sans-serif';
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.fillText(displayName.textContent, canvas.width / 2, 70);

            // QR Code
            ctx.drawImage(qrCanvas, 175, 100, 350, 350);

            // UPI ID
            ctx.font = '24px Orbitron, Arial, sans-serif';
            ctx.fillStyle = '#333333';
            ctx.fillText(displayUpi.textContent, canvas.width / 2, 480);

            // Instruction
            ctx.font = '20px Arial, sans-serif';
            ctx.fillStyle = '#555';
            ctx.fillText('Scan and pay with any BHIM UPI app', canvas.width / 2, 520);

            // Payment App Icons
            const icons = [
                { text: 'GPay', color: '#4285F4' },
                { text: 'PhonePe', color: '#5f259f' },
                { text: 'Paytm', color: '#0033cc' },
                { text: 'Amazon Pay', color: '#ff9900' }
            ];
            const startX = 60;
            const y = 560;
            const iconW = 130, iconH = 50;
            const gap = 20;

            icons.forEach((icon, i) => {
                const x = startX + i * (iconW + gap);
                ctx.fillStyle = icon.color;
                ctx.fillRect(x, y, iconW, iconH);
                ctx.font = 'bold 18px Arial, sans-serif';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText(icon.text, x + iconW / 2, y + 32);
            });

            // Footer Note
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.fillStyle = '#e60000';
            ctx.fillText('🙏 Radhe Radhe 🙏', canvas.width / 2, 850);

            // Create download link
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${displayUpi.textContent.split('@')[0]}_QRCode.png`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (err) {
            console.error('Download error:', err);
            alert('Download failed. Please try again in Chrome/Firefox.');
        }
    });

    [merchantName, upiId, amount].forEach(input => {
        input.addEventListener('input', generateQR);
    });
});
</script>
