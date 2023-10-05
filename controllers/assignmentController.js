const Assignment = require('../models/assignment');
const { literal } = require('sequelize');

const responseAssignment = (assignment) => {
  return {
      id: assignment.id,
      name: assignment.name,
      points: assignment.points,
      num_of_attempts: assignment.num_of_attempts,
      deadline: assignment.deadline,
      assignment_created: assignment.assignment_created,
      assignment_updated: assignment.assignment_updated,
  }
}

// Create a new assignment
exports.createAssignment = async (req, res) => {
  // If there is a body in the request, then return a response as 400(Bad Request)
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).header('Cache-Control', 'no-cache').send();
  }

  const { name, points, num_of_attempts, deadline } = req.body;
  const user = req.user;

  if(points < 1 || points > 10){
    return res.status(400).json({ error: 'Assignment points should be inbetween 1 to 10 (inclusive)' });
  }

  try {
    // Create the assignment and associate it with the authenticated user's email
    const assignment = await Assignment.create({
      name,
      points,
      num_of_attempts,
      deadline,
      accountId: user.id, // Associate with the authenticated user's Id
    });

    res.status(201).json(responseAssignment(assignment));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a list of all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    // Get all assignments
    const assignments = await Assignment.findAll({ where: {} });
    // Create a response object containing all assignments
    const responseAssignments = assignments.map((assignment) => ({
      id: assignment.id,
      name: assignment.name,
      points: assignment.points,
      num_of_attempts: assignment.num_of_attempts,
      deadline: assignment.deadline,
      assignment_created: assignment.assignment_created,
      assignment_updated: assignment.assignment_updated,
    }));

    res.status(200).json(responseAssignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get assignment details by ID
exports.getAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the assignment by ID
    const assignment = await Assignment.findOne({ where: {id} });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // // Check if the authenticated user is the creator
    // if (assignment.accountId !== req.user.id) {
    //   return res.status(403).json({ error: 'Forbidden: You do not have permission to get this assignment details' });
    // }

    res.status(200).json(responseAssignment(assignment));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an assignment by ID
exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { name, points, num_of_attempts, deadline } = req.body;

  try {
    // Find the assignment by ID and ensure it's associated with the authenticated user's Id
    const assignment = await Assignment.findOne({ where: {id} });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if the authenticated user is the creator
    if (assignment.accountId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this assignment' });
    }

    if(points < 1 || points > 10){
      return res.status(400).json({ error: 'Assignment points should be inbetween 1 to 10 (inclusive)' });
    }
    // Update assignment fields
    assignment.name = name;
    assignment.points = points;
    assignment.num_of_attempts = num_of_attempts;
    assignment.deadline = deadline;
    assignment.assignment_updated = literal('CURRENT_TIMESTAMP');

    await assignment.save();
    res.status(204).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an assignment by ID
exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the assignment by ID and ensure it's associated with the authenticated user's Id
    const assignment = await Assignment.findOne({ where: {id} });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if the authenticated user is the creator
    if (assignment.accountId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this assignment' });
    }

    await assignment.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
