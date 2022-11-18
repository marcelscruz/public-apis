const fs = require('fs')

module.exports = async function ({ data, filePath }) {
    await fs.writeFile(filePath, data, error => {
        if (error) {
            throw new Error(`Error writing to file: ${error}`)
        }
    })

    return
}
