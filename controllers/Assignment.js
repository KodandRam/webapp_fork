const { Assignment } = require('../models/model');
const { ValidationError } = require('sequelize');

const hasPayload = (req) => req.body && Object.keys(req.body).length !== 0;
const hasQueryParameters = (req) => req.query && Object.keys(req.query).length !== 0;

const getAssignments = async (req, res) => {
    if (hasPayload(req) || hasQueryParameters(req)) {
        // Payload not allowed, Query parameters not allowed
        return res.status(400).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        }).send({ error: 'Payload or query parameters not allowed' });
    }

    try {
        const assignments = await Assignment.findAll();
        // const assignments = await Assignment.findAll({ where: { accountId: req.account.id } });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch assignments.' });
    }
};

const getAssignmentById = async (req, res) => {
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!uuidPattern.test(req.params.id)) {
        return res.status(400).json({ error: 'Invalid UUID format.' });
    }

    if (hasPayload(req) || hasQueryParameters(req)) {
        // Payload not allowed, Query parameters not allowed
        return res.status(400).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        }).send({ error: 'Payload or query parameters not allowed' });
    }

    try {
        const assignment = await Assignment.findByPk(req.params.id);
        if (assignment) {
            res.json(assignment);
        } else {
            res.status(404).json({ error: 'Assignment not found.' });
        }
    } catch (err) {
        console.error('Error in getAssignmentById:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const validateAssignmentData = (assignmentData) => {
    const { assignment_created, assignment_updated, ...validatedData } = assignmentData;

    const errors = [];
    if (validatedData.points < 1 || validatedData.points > 100) {
        errors.push('Assignment points must be between 1 and 100.');
    }
    if (validatedData.num_of_attempts < 1 || validatedData.num_of_attempts > 100) {
        errors.push('num_of_attempts must be between 1 and 100.');
    }

    return { validatedData, errors };
};

const createAssignment = async (req, res) => {
    const { validatedData, errors } = validateAssignmentData(req.body);

    if (errors.length > 0) {
        return res.status(400).json({ error: errors });
    }

    try {
        const assignment = await Assignment.create({ ...validatedData, accountId: req.account.id });
        res.status(201).json(assignment);

    } catch (err) {
        console.log(err);
        if (err instanceof ValidationError) {
            res.status(400).json({ error: err.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: 'Failed to create assignment.' });
        }
    }
};

const updateAssignment = async (req, res) => {
    const { validatedData, errors } = validateAssignmentData(req.body);

    if (errors.length > 0) {
        return res.status(400).json({ error: errors });
    }

    try {
        const assignment = await Assignment.findOne({ where: { id: req.params.id, accountId: req.account.id } });
        if (!assignment) return res.status(403).json({ error: 'Not authorized to update this assignment.' });

        validatedData.assignment_updated = new Date();
        await assignment.update(validatedData);
        res.status(204).send();
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).json({ error: err.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: 'Failed to update assignment.' });
        }
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findOne({ where: { id: req.params.id, accountId: req.account.id } });
        if (!assignment) return res.status(403).json({ error: 'Not authorized to delete this assignment.' });

        await assignment.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete assignment.' });
    }
};


module.exports = {
    getAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
};