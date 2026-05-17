const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const aiController = require('../controllers/aiController');

// Candidate Routes
router.post('/candidates', candidateController.createCandidate);
router.get('/candidates', candidateController.getCandidates);
router.post('/match', candidateController.matchCandidates);

// AI Route
router.post('/ai/shortlist', aiController.aiShortlist);

module.exports = router;
