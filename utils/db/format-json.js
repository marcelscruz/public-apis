module.exports = function (entries) {
    return `{\n"count": ${entries.length},\n"entries": ${JSON.stringify(entries, null, 4)}}`
}
