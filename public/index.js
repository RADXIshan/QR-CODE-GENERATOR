async function generateQR() {
    const url = document.getElementById('url-input').value;
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate QR code');
        }

        const data = await response.json();
        const qrcodeDiv = document.getElementById('qrcode');
        qrcodeDiv.innerHTML = `<img src="${data.qrDataUrl}" alt="QR Code">`;
        qrcodeDiv.classList.add('has-qr');
        document.getElementById('download-btn').style.display = 'inline-block';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate QR code. Please try again.');
    }
}

async function downloadQR() {
    const url = document.getElementById('url-input').value;
    if (!url) {
        alert('Please enter a URL first');
        return;
    }

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error('Failed to download QR code');
        }

        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'qrcode.png';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to download QR code. Please try again.');
    }
} 