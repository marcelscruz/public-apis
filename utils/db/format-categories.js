module.exports = function (categories) {
    return categories.map(category => ({
        name: category,
        slug: category
            .trim()
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^A-Z0-9/]+/gi, '-')
            .replace(/\s/g, '-'),
    }))
}
