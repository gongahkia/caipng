/**
 * Live Routes (V2)
 * - POST /api/live/analyze: analyze a single frame (base64) and return boxes + labels + confidences
 * - POST /api/live/macros: call LLM (Gemini) with derived text to estimate macros
 */

const express = require('express');
const router = express.Router();
const { analyzeFrame, estimateMacros } = require('../controllers/liveController');

router.post('/analyze', analyzeFrame);
router.post('/macros', estimateMacros);

module.exports = router;
