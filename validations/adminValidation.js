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

const passwordField = (minLen = 1) =>
    Joi.string()
        .min(minLen)
        .required()
        .messages({
            'string.base': 'Password must be a string.',
            'string.min': `Password must be at least ${minLen} characters long.`,
            'any.required': 'Password is required.',
        });

const mongoIdField = (label = 'ID') =>
    Joi.string().required().messages({
        'string.base': `${label} must be a string.`,
        'any.required': `${label} is required.`,
    });

// ─── Admin schemas ────────────────────────────────────────────────────────────

export const loginAdminSchema = Joi.object({
    email: emailField,
    password: passwordField(),
});

export const addDoctorSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.base': 'Name must be a string.',
        'string.min': 'Name must be at least 2 characters long.',
        'string.max': 'Name must not exceed 100 characters.',
        'any.required': 'Doctor name is required.',
    }),
    email: emailField,
    password: passwordField(8),
    speciality: Joi.string().min(2).required().messages({
        'string.base': 'Speciality must be a string.',
        'string.min': 'Speciality must be at least 2 characters long.',
        'any.required': 'Speciality is required.',
    }),
    degree: Joi.string().min(2).required().messages({
        'string.base': 'Degree must be a string.',
        'string.min': 'Degree must be at least 2 characters long.',
        'any.required': 'Degree is required.',
    }),
    experience: Joi.string().required().messages({
        'string.base': 'Experience must be a string.',
        'any.required': 'Experience is required.',
    }),
    about: Joi.string().min(10).required().messages({
        'string.base': 'About must be a string.',
        'string.min': 'About section must be at least 10 characters long.',
        'any.required': 'About is required.',
    }),
    fees: Joi.number().positive().required().messages({
        'number.base': 'Fees must be a number.',
        'number.positive': 'Fees must be a positive number.',
        'any.required': 'Fees are required.',
    }),
    // address is sent as a JSON string from multipart/form-data
    address: Joi.string().required().messages({
        'string.base': 'Address must be a JSON string.',
        'any.required': 'Address is required.',
    }),
});

export const cancelAppointmentAdminSchema = Joi.object({
    appointmentId: mongoIdField('Appointment ID'),
});

export const changeAvailabilitySchema = Joi.object({
    docId: mongoIdField('Doctor ID'),
});
