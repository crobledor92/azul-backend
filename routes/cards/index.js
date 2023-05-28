const express = require('express');
const router = express.Router();
const { createAllCardsSummary } = require('../../controllers/cardController.jsx')

/* GET users listing. */
router.post('/addAllCards', createAllCardsSummary);

module.exports = router;