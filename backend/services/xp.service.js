const calculateLevel = (xp) => {
    return Math.floor(xp / 100);
};

const XP_RULES = {
    CORRECT_ANSWER: 10,
    COMPLETE_LESSON: 20,
    COMPLETE_TOPIC: 100
};

module.exports = {
    calculateLevel,
    XP_RULES
};
