var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: '3D model viewer demo' });
});

router.get('/:viewer', function (req, res, next) {
    const viewer = req.params.viewer;
    const file = 'cube.glb';
    res.render(viewer, { title: viewer, file: file });
});

router.get('/:viewer/:file', function (req, res, next) {
    const viewer = req.params.viewer;
    const file = req.params.file;
    res.render(viewer, { title: viewer, file: file });
});

// POST route for saving screenshots
router.post('/save-screenshot', function (req, res, next) {
    try {
        const { imageData, filename } = req.body;
        
        // Remove data URL prefix (data:image/png;base64,)
        const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
        
        // Create screenshots directory if it doesn't exist
        const screenshotsDir = path.join(__dirname, '../public/screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
        
        // Generate unique filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const finalFilename = filename || `screenshot-${timestamp}.png`;
        const filepath = path.join(screenshotsDir, finalFilename);
        
        // Save the file
        fs.writeFileSync(filepath, base64Data, 'base64');
        
        res.json({ 
            success: true, 
            message: '截圖已成功儲存', 
            filename: finalFilename,
            path: `/screenshots/${finalFilename}`
        });
    } catch (error) {
        console.error('Error saving screenshot:', error);
        res.status(500).json({ 
            success: false, 
            message: '儲存截圖時發生錯誤' 
        });
    }
});

module.exports = router;
