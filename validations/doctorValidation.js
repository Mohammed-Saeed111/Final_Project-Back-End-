import Joi from 'joi';

// ─── Reusable field definitions ───────────────────────────────────────────────

const emailField = Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.',
    });

const mongoIdField = (label = 'ID') =>
    Joi.string().required().messages({
        'string.base': `${label} must be a string.`,
        'any.required': `${label} is required.`,
    });

const addressField = Joi.alternatives()
    .try(
        Joi.object({
            line1: Joi.string().allow('').optional(),
            line2: Joi.string().allow('').optional(),
        }),
        Joi.string()
    )
    .required()
    .messages({ 'any.required': 'Address is required.' });

// ─── Doctor schemas ───────────────────────────────────────────────────────────

export const loginDoctorSchema = Joi.object({
    email: emailField,
    password: Joi.string().min(8).required().messages({
        'string.base': 'Password must be a string.',
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'Password is required.',
    }),
});

export const appointmentActionSchema = Joi.object({
    docId: mongoIdField('Doctor ID'),
    appointmentId: mongoIdField('Appointment ID'),
});

export const updateDoctorProfileSchema = Joi.object({
    docId: mongoIdField('Doctor ID'),
    fees: Joi.number().positive().required().messages({
        'number.base': 'Fees must be a number.',
        'number.positive': 'Fees must be a positive number.',
        'any.required': 'Fees are required.',
    }),
    address: addressField,
    available: Joi.boolean().required().messages({
        'boolean.base': 'Available must be a boolean value (true or false).',
        'any.required': 'Availability status is required.',
    }),
});
