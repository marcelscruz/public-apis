module.exports = function (tables) {
    return tables.map(({ name, rows }) => {
        const content = []

        rows.forEach((child, i) => {
            if (i === 0) return // Table header

            if (child.type === 'link') {
                content.push({
                    link: child.url,
                    name: child.children[0].value,
                    description: '',
                })
            } else {
                const lastContentItem = content.pop()
                content.push({
                    ...lastContentItem,
                    description: `${lastContentItem.description} ${child.value}`,
                })
            }
        })

        return { name, rows: content }
    })
}
