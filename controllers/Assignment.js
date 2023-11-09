const { Assignment } = require('../models/model');
const { ValidationError } = require('sequelize');
const logger = require('../log');

const hasPayload = (req) => req.body && Object.keys(req.body).length !== 0;
const hasQueryParameters = (req) => req.query && Object.keys(req.query).length !== 0;

const getAssignments = async (req, res) => {
    logger.debug("Accessed getAssignments()");
    if (hasPayload(req) || hasQueryParameters(req)) {
        // Payload not allowed, Query parameters not allowed
        logger.error("Payload or Query parameters not allowed");
        return res.status(400).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        }).send({ error: 'Payload or query parameters not allowed' });
    }

    try {
        const assignments = await Assignment.findAll();
        // const assignments = await Assignment.findAll({ where: { accountId: req.account.id } });
        logger.info(`Fetched ${assignments.length} assignments successfully`);
        res.json(assignments);
    } catch (err) {
        logger.error(`Error in getAssignments: ${err.message} - Failed to fetch assignments`);
        res.status(500).json({ error: 'Failed to fetch assignments.' });
    }
};

const getAssignmentById = async (req, res) => {
    logger.debug("Accessed getAssignmentById()");
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!uuidPattern.test(req.params.id)) {
        logger.error(`Invalid UUID format - Assignment: ${req.params.id}`);
        return res.status(400).json({ error: 'Invalid UUID format.' });
    }

    if (hasPayload(req) || hasQueryParameters(req)) {
        // Payload not allowed, Query parameters not allowed
        logger.error("Payload or Query parameters not allowed");
        return res.status(400).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        }).send({ error: 'Payload or query parameters not allowed' });
    }

    try {
        const assignment = await Assignment.findByPk(req.params.id);
        if (assignment) {
            logger.info(`Fetched assignment ${assignment.name} successfully`);
            res.json(assignment);
        } else {
            logger.error(`Assignment Not Found - Assignment: ${req.params.id}`);
            res.status(404).json({ error: 'Assignment not found.' });
        }
    } catch (err) {
        console.error('Error in getAssignmentById:', err);
        logger.error(`Error in getAssignmentById: ${err.message} - Failed to fetch assignment`);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const validateAssignmentData = (assignmentData) => {

    const expectedKeys = ['name', 'points', 'num_of_attempts', 'deadline'];
    const dataKeys = Object.keys(assignmentData);

    const errors = [];

    // Check for unwanted keys
    dataKeys.forEach(key => {
        if (!expectedKeys.includes(key)) {
            errors.push(`Invalid key "${key}" in payload.`);
        }
    });

    // Name validation
    if (typeof assignmentData.name !== 'string') {
        errors.push('Name must be a string.');
    }

    // Points validation
    if (typeof assignmentData.points !== 'number' || !Number.isInteger(assignmentData.points)) {
        errors.push('Points must be an integer.');
    }

    // Num of attempts validation
    if (typeof assignmentData.num_of_attempts !== 'number' || !Number.isInteger(assignmentData.num_of_attempts)) {
        errors.push('num_of_attempts must be an integer.');
    }
    // Regex to match YYYY-MM-DDTHH:mm:ss.sssZ format
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

    // Check if the deadline input is a string and matches expected format
    if (typeof assignmentData.deadline !== 'string' || !dateRegex.test(assignmentData.deadline)) {
        errors.push('Deadline must be provided in a valid date format (YYYY-MM-DDTHH:mm:ss.sssZ).');
    } else {
        const deadlineDate = new Date(assignmentData.deadline);

        // Check if the provided string could be turned into a valid date
        if (!(deadlineDate instanceof Date && !isNaN(deadlineDate))) {
            errors.push('Deadline must be a valid date.');
        } else {
            // If it's a valid date, check if it's in the future
            if (deadlineDate <= new Date()) {
                errors.push('Deadline must be in the future.');
            }
        }
    }


    const { assignment_created, assignment_updated, ...validatedData } = assignmentData;

    if (validatedData.points < 1 || validatedData.points > 100) {
        errors.push('Assignment points must be between 1 and 100.');
    }
    if (validatedData.num_of_attempts < 1 || validatedData.num_of_attempts > 100) {
        errors.push('num_of_attempts must be between 1 and 100.');
    }

    return { validatedData, errors };
};

const createAssignment = async (req, res) => {

    logger.debug("Accessed createAssignment()");
    const { validatedData, errors } = validateAssignmentData(req.body);

    if (errors.length > 0) {
        logger.error("Error creating assignment: ", errors);
        return res.status(400).json({ error: errors });
    }

    try {
        const assignment = await Assignment.create({ ...validatedData, accountId: req.account.id });
        logger.info(`Created assignment ${assignment.name} successfully`);
        res.status(201).json(assignment);

    } catch (err) {
        console.log(err);
        if (err instanceof ValidationError) {
            logger.error(`Validation Error: ${err.errors.map(e => e.message)}`);
            res.status(400).json({ error: err.errors.map(e => e.message) });
        } else {
            logger.error(`Error creating assignment: ${err.message}`);
            res.status(500).json({ error: 'Failed to create assignment.' });
        }
    }
};

const deleteAssignment = async (req, res) => {
    logger.debug("Accessed deleteAssignment()");

    try {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

        if (!uuidPattern.test(req.params.id)) {
            logger.error(`Invalid UUID format - Assignment: ${req.params.id}`);
            return res.status(400).json({ error: 'Invalid UUID format.' });
        }

        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });

        if (assignment.accountId !== req.account.id) {
            logger.error(`Forbidden - Not authorized to delete this assignment`);
            return res.status(403).json({ error: 'Not authorized to delete this assignment.' });
        }

        await assignment.destroy();
        logger.info(`Deleted assignment ${req.params.id} Successfully`);
        res.status(204).send();
    } catch (err) {
        console.error('Error during deletion:', err);
        logger.error(`Error during deletion: ${err.message} - Failed to delete assignment`);
        res.status(500).json({ error: 'Failed to delete assignment.' });
    }
};

const updateAssignment = async (req, res) => {
    logger.debug("Accessed updateAssignment()");
    const { validatedData, errors } = validateAssignmentData(req.body);

    if (errors.length > 0) {
        logger.error(`Error updating assignment: ${errors}`);
        return res.status(400).json({ error: errors });
    }

    try {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

        if (!uuidPattern.test(req.params.id)) {
            logger.error(`Invalid UUID format - Assignment: ${req.params.id}`);
            return res.status(400).json({ error: 'Invalid UUID format.' });
        }

        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) {
            logger.error(`updateAssignment() - Assignment Not Found`)
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        if (assignment.accountId !== req.account.id) {
            logger.error(`updateAssignment() - Not authorized to update this assignment`);
            return res.status(403).json({ error: 'Not authorized to update this assignment.'});
        }

        validatedData.assignment_updated = new Date();
        await assignment.update(validatedData);
        logger.info(`Assignment ${assignment.name} successfully updated`);
        res.status(204).send();
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).json({ error: err.errors.map(e => e.message) });
            logger.error(`validation Error: ${err.errors.map(e => e.message)}`);
        } else {
            res.status(500).json({ error: 'Failed to update assignment.' });
        }
    }
};


module.exports = {
    getAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
};