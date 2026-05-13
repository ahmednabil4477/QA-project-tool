/**
 * Parses an integer from a route parameter.
 * Returns NaN if the param is missing or not numeric.
 */
const parseId = (param) => parseInt(param, 10);

/**
 * Centralised 500 handler. Logs the error and sends a generic response.
 */
const handleError = (res, err) => {
    console.error(err);
    res.status(500).json({ error: err.message });
};

/**
 * Sends a 404 if the given record is null/undefined, otherwise calls next().
 */
const requireRecord = (res, record, label) => {
    if (!record) {
        res.status(404).json({ message: `${label} not found` });
        return false;
    }
    return true;
};

module.exports = { parseId, handleError, requireRecord };
