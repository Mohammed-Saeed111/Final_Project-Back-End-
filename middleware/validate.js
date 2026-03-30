/**
 * validate – factory that returns an Express middleware which validates
 * req.body (or req.query for GET routes) against the provided Joi schema.
 *
 * On success  → sanitised value replaces req.body / req.query and next() is called.
 * On failure  → HTTP 400 with { success: false, message: "<all error details>" }.
 *
 * @param {import('joi').Schema} schema   Joi schema to validate against
 * @param {'body'|'query'|'params'} [source='body']  Which part of req to validate
 * @returns {Function}  Express middleware
 */
const validate = (schema, source = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const message = error.details.map((d) => d.message).join(' | ');
        return res.status(400).json({ success: false, message });
    }

    // Preserve ALL auth-injected fields that appear in req.body before validation.
    // authUser  → injects userId
    // authDoctor → injects docId
    // These are not part of the request schema so stripUnknown removes them; we put them back.
    const { userId, docId } = req[source];
    req[source] = value;
    if (userId && !req[source].userId) req[source].userId = userId;
    if (docId  && !req[source].docId)  req[source].docId  = docId;
    next();
};

export default validate;
