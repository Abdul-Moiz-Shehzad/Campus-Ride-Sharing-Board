const express = require('express');
const authMiddleware = require('../middleware/auth');
const requestController = require('../controllers/requestController');

const router = express.Router();

// Public routes
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);

// Protected routes
router.post('/', authMiddleware, requestController.createRequest);
router.put('/:id', authMiddleware, requestController.updateRequest);
router.delete('/:id', authMiddleware, requestController.deleteRequest);
router.post('/fulfill', authMiddleware, requestController.fulfillRequest);
router.get('/responses/my-responses', authMiddleware, requestController.getUserResponses);

module.exports = router;
