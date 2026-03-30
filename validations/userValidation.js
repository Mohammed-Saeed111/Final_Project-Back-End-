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
    .optional()
    .messages({ 'any.required': 'Address is required.' });

// ─── User schemas ─────────────────────────────────────────────────────────────

export const registerUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.base': 'Name must be a string.',
        'string.min': 'Name must be at least 2 characters long.',
        'string.max': 'Name must not exceed 100 characters.',
        'any.required': 'Name is required.',
    }),
    email: emailField,
    password: Joi.string().min(8).required().messages({
        'string.base': 'Password must be a string.',
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'Password is required.',
    }),
});

export const loginUserSchema = Joi.object({
    email: emailField,
    password: Joi.string().required().messages({
        'string.base': 'Password must be a string.',
        'any.required': 'Password is required.',
    }),
});

export const bookAppointmentSchema = Joi.object({
    userId: mongoIdField('User ID'),
    docId: Joi.string().required(),
    slotDate: Joi.string().pattern(/^\d{1,2}_\d{1,2}_\d{4}$/).required().messages({
        'string.pattern.base': 'Slot date must be in the format D_M_YYYY (e.g. 5_3_2025).',
        'any.required': 'Slot date is required.',
    }),
    slotTime: Joi.string().required(),
    docData: Joi.alternatives().try(Joi.object().unknown(true), Joi.string()).optional(),
});

export const cancelAppointmentUserSchema = Joi.object({
    userId: mongoIdField('User ID'),
    appointmentId: mongoIdField('Appointment ID'),
});

export const updateUserProfileSchema = Joi.object({
    userId: Joi.string().optional(),
    name: Joi.string().min(2).max(100).required().messages({
        'string.base': 'Name must be a string.',
        'string.min': 'Name must be at least 2 characters long.',
        'string.max': 'Name must not exceed 100 characters.',
        'any.required': 'Name is required.',
    }),
    phone: Joi.string().allow('').optional(),
    address: addressField,
    dob: Joi.string().allow('').optional(),
    gender: Joi.string()
        .valid('Male', 'Female', 'Other', 'Not Selected')
        .optional()
        .messages({
            'any.only': 'Gender must be one of: Male, Female, Other, Not Selected.',
        }),
});

export const paymentSchema = Joi.object({
    appointmentId: mongoIdField('Appointment ID'),
});

export const verifyRazorpaySchema = Joi.object({
    razorpay_order_id: Joi.string().required().messages({
        'string.base': 'Razorpay order ID must be a string.',
        'any.required': 'Razorpay order ID is required.',
    }),
});
