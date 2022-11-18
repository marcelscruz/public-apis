module.exports = function (tables) {
    return tables
        .map(({ name: categoryName, rows }) => {
            return rows.map(({ link, name: entryName, description: rawDescription }) => {
                const [description, auth, https, cors] = rawDescription
                    .split('|')
                    .map(item => item.trim())
                    .filter(item => item)

                return {
                    API: entryName,
                    Description: description,
                    Auth: auth?.toLowerCase() === 'no' ? '' : auth,
                    HTTPS: https?.toLowerCase() === 'yes' ? true : false,
                    Cors: cors?.toLowerCase(),
                    Link: link,
                    Category: categoryName,
                }
            })
        })
        .flat()
}
