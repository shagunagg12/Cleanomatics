const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

export const validateTaskPayload = (isUpdate = false) => {
  return (req, res, next) => {
    const { title, description, status, priority, dueDate } = req.body;
    const errors = {};

    // For create, title is required. For update, if provided, must not be empty.
    if (!isUpdate || title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.title = 'Title is required and cannot be empty.';
      } else if (title.trim().length > 150) {
        errors.title = 'Title must not exceed 150 characters.';
      }
    }

    // For create, description is required. For update, if provided, must not be empty.
    if (!isUpdate || description !== undefined) {
      if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.description = 'Description is required and cannot be empty.';
      } else if (description.trim().length > 2000) {
        errors.description = 'Description must not exceed 2000 characters.';
      }
    }

    // Status validation
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}.`;
      }
    }

    // Priority validation
    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`;
      }
    }

    // Due date validation
    if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        errors.dueDate = 'Due date must be a valid ISO or YYYY-MM-DD date string.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for task data.',
        errors,
      });
    }

    next();
  };
};
