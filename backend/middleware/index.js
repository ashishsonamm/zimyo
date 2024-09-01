const authMiddleware = require("./auth");
const roleAuth = require("./roleAuth");
const { validateArtworkCreation, validateArtworkSearch, validateArtworkId } = require('./validateInput');

module.exports = {
    authMiddleware,
    roleAuth,
    validateArtworkCreation,
    validateArtworkSearch,
    validateArtworkId
}