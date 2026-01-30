const Log = require("../models/Log");

/**
 * @Desc This middleware logs the events/actions performed by the users.
 * @param {*} event The method expects the event type being performed by the user from the list of available events
 */

const Logger = (event) => {
    return async (req, res, next) => {
        try {
            const newLog = new Log({
                user: req.user._id,
                userModel: req.user.role,
                event_type: event.type,
                event_detail: event.detail,
                ip: req.ip,
            });
            await newLog.save();
        } catch (err) {
            console.log('Error saving log:', err);
        }
        next();
    };
};

module.exports = Logger;
