import express from 'express';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/:viewer', function (req, res, next) {
    const viewer = req.params.viewer;
    const file = 'cube.glb';
    
    // Check if viewer template exists
    const viewPath = path.join(__dirname, '../views', `${viewer}.ejs`);
    if (!fs.existsSync(viewPath)) {
        return res.status(404).render('error', { 
            message: `Viewer '${viewer}' not found`,
            error: { status: 404 }
        });
    }
    
    res.render(viewer, { title: viewer, file: file });
});

router.get('/:viewer/:file', function (req, res, next) {
    const viewer = req.params.viewer;
    const file = req.params.file;
    
    // Check if viewer template exists
    const viewPath = path.join(__dirname, '../views', `${viewer}.ejs`);
    if (!fs.existsSync(viewPath)) {
        return res.status(404).render('error', { 
            message: `Viewer '${viewer}' not found`,
            error: { status: 404 }
        });
    }
    
    // Check if file exists
    const filePath = path.join(__dirname, '../public/assets', file);
    if (!fs.existsSync(filePath)) {
        return res.status(404).render('error', { 
            message: `File '${file}' not found`,
            error: { status: 404 }
        });
    }
    
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

export default router;
