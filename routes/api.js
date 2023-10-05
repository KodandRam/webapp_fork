// routes/api.js
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const {authentication, inValidHealthRequests, inValidRequests} = require('../middleware/authentication');
const healthzController = require('../controllers/healthzController');

//Health Check routes
router.route('/healthz').get(healthzController).all(inValidHealthRequests);

// Public routes
router.use(authentication);

//Protected routes (require authentication)
router.get('/v1/assignments', assignmentController.getAllAssignments);
router.post('/v1/assignments', assignmentController.createAssignment);
router.get('/v1/assignments/:id', assignmentController.getAssignmentById);
router.put('/v1/assignments/:id', assignmentController.updateAssignment);
router.delete('/v1/assignments/:id', assignmentController.deleteAssignment);
router.use(inValidRequests);

module.exports = router;
