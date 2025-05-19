document.addEventListener('DOMContentLoaded', function() {
    const merchantName = document.getElementById('merchant-name');
    const upiId = document.getElementById('upi-id');
    const amount = document.getElementById('amount');
    const downloadBtn = document.getElementById('download-btn');
    const qrCodeDiv = document.getElementById('qr-code');
    const displayName = document.getElementById('display-name');
    const displayUpi = document.getElementById('display-upi');

    let qrCode = null;
    let qrCanvas = null;

    function generateQR() {
        const name = merchantName.value.trim() || "MERCHANT";
        const upi = upiId.value.trim();
        const amt = amount.value.trim();

        // Clear previous QR code
        qrCodeDiv.innerHTML = '';
        downloadBtn.disabled = true;

        if (!upi) {
            qrCodeDiv.innerHTML = '<div class="hint"><i class="fas fa-qrcode"></i> Enter UPI ID to generate QR code</div>';
            displayName.textContent = "MERCHANT NAME";
            displayUpi.textContent = "merchant@upi";
            return;
        }

        // Validate UPI ID format
        if (!upi.includes('@')) {
            qrCodeDiv.innerHTML = '<div class="hint" style="color:red"><i class="fas fa-exclamation-circle"></i> Invalid UPI ID format (must contain @)</div>';
            return;
        }

        // Validate amount if provided
        if (amt && isNaN(amt)) {
            qrCodeDiv.innerHTML = '<div class="hint" style="color:red"><i class="fas fa-exclamation-circle"></i> Invalid amount</div>';
            return;
        }

        // Create UPI payment link
        let upiLink = `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}`;
        if (amt) upiLink += `&am=${parseFloat(amt).toFixed(2)}`;

        // Generate QR code
        try {
            // Create canvas element for QR code
            qrCodeDiv.innerHTML = '<canvas id="qr-canvas"></canvas>';
            qrCanvas = document.getElementById('qr-canvas');
            
            // Use QRCode.js to generate the QR code
            qrCode = new QRCode(qrCanvas, {
                text: upiLink,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Update displayed information
            displayName.textContent = name.toUpperCase();
            displayUpi.textContent = upi;
            downloadBtn.disabled = false;
        } catch (error) {
            console.error("QR Generation Error:", error);
            qrCodeDiv.innerHTML = '<div class="hint" style="color:red"><i class="fas fa-exclamation-circle"></i> Error generating QR code</div>';
        }
    }

    downloadBtn.addEventListener('click', function() {
        try {
            if (!qrCanvas) {
                throw new Error('Please generate a QR code first');
            }

            // Create a new canvas for the downloadable image
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 700;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Merchant Name
            ctx.fillStyle = '#5e35b1';
            ctx.font = 'bold 28px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(displayName.textContent, canvas.width / 2, 50);

            // UPI ID
            ctx.fillStyle = '#333333';
            ctx.font = '20px Poppins';
            ctx.fillText(displayUpi.textContent, canvas.width / 2, 90);

            // QR Code
            ctx.drawImage(qrCanvas, (canvas.width - 250) / 2, 120, 250, 250);

            // Instruction
            ctx.fillStyle = '#555555';
            ctx.font = '18px Poppins';
            ctx.fillText('Scan and pay with any UPI app', canvas.width / 2, 420);

            // App Icons
            const apps = [
                { name: 'Google Pay', color: '#4285F4' },
                { name: 'PhonePe', color: '#5F259F' },
                { name: 'Paytm', color: '#00BAF2' },
                { name: 'BHIM', color: '#5e35b1' }
            ];
            
            const startX = 50;
            const iconY = 450;
            const iconWidth = 120;
            const iconHeight = 50;
            const gap = 20;

            apps.forEach((app, index) => {
                const x = startX + index * (iconWidth + gap);
                ctx.fillStyle = app.color;
                ctx.fillRect(x, iconY, iconWidth, iconHeight);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px Poppins';
                ctx.textAlign = 'center';
                ctx.fillText(app.name, x + iconWidth / 2, iconY + iconHeight / 2 + 5);
            });

            // Footer
            ctx.fillStyle = '#888888';
            ctx.font = '14px Poppins';
            ctx.fillText('Generated with UPI QR Code Generator', canvas.width / 2, 650);

            // Create download link
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${displayUpi.textContent.split('@')[0]}_qrcode.png`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error("Download Error:", error);
            alert('Download failed. Please try again in Chrome/Firefox.');
        }
    });

    // Add input event listeners with debounce
    let debounceTimer;
    [merchantName, upiId, amount].forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(generateQR, 500);
        });
    });
});
