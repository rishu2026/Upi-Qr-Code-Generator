document.addEventListener('DOMContentLoaded', function() {
    // 1. Get all elements
    const merchantName = document.getElementById('merchant-name');
    const upiId = document.getElementById('upi-id');
    const amount = document.getElementById('amount');
    const downloadBtn = document.getElementById('download-btn');
    const qrCodeDiv = document.getElementById('qr-code');
    const displayName = document.getElementById('display-name');
    const displayUpi = document.getElementById('display-upi');
    
    let qrCode = null;

    // 2. QR Generation
    function generateQR() {
        const name = merchantName.value.trim() || "MERCHANT";
        const upi = upiId.value.trim();
        const amt = amount.value.trim();

        // Clear previous QR
        qrCodeDiv.innerHTML = '';
        downloadBtn.disabled = true;

        if (!upi) {
            qrCodeDiv.innerHTML = '<div class="hint"><i class="fas fa-qrcode"></i> Enter UPI ID</div>';
            displayName.textContent = "MERCHANT NAME";
            displayUpi.textContent = "merchant@upi";
            return;
        }

        // Generate UPI link
        let upiLink = `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}`;
        if (amt) upiLink += `&am=${parseFloat(amt).toFixed(2)}`;

        // Create QR code
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

    // 3. BULLETPROOF Download Function
    downloadBtn.addEventListener('click', function() {
        try {
            const qrCanvas = document.querySelector('#qr-code canvas');
            if (!qrCanvas) {
                throw new Error('Please generate a QR code first');
            }

            // Create a new temporary canvas
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = 300;
            tempCanvas.height = 400;
            
            // Draw white background
            tempCtx.fillStyle = 'white';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Draw merchant info
            tempCtx.fillStyle = '#5e35b1';
            tempCtx.font = 'bold 20px Arial';
            tempCtx.textAlign = 'center';
            tempCtx.fillText(displayName.textContent, 150, 40);
            
            tempCtx.fillStyle = '#666';
            tempCtx.font = '16px Arial';
            tempCtx.fillText(displayUpi.textContent, 150, 70);
            
            // Draw QR code (centered)
            tempCtx.drawImage(qrCanvas, 50, 100, 200, 200);
            
            // Draw instruction text
            tempCtx.fillStyle = '#333';
            tempCtx.font = '500 16px Arial';
            tempCtx.fillText('Scan with any UPI app', 150, 340);
            
            // Convert to image and download
            const upiId = displayName.textContent.trim(); // assuming this holds "736191@upi"
const namePart = upiId.split('@')[0]; // gets "736191"

const link = document.createElement('a');
link.href = tempCanvas.toDataURL('image/png');
link.download = `${namePart}.png`; // results in "736191.png"
link.click();

        } catch (error) {
            console.error("Download Error:", error);
            alert('Download failed. Please try again in Chrome/Firefox.');
        }
    });

    // 4. Auto-generate on input
    [merchantName, upiId, amount].forEach(input => {
        input.addEventListener('input', generateQR);
    });
});
