const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate QR code endpoint
app.post('/generate', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(url, {
            width: 200,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        res.json({ qrDataUrl });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// Download QR code endpoint
app.post('/download', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Generate QR code as buffer
        const qrBuffer = await QRCode.toBuffer(url, {
            width: 200,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        // Set headers for download
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=qrcode.png');
        
        // Send the buffer
        res.send(qrBuffer);
    } catch (error) {
        console.error('Error generating QR code for download:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});