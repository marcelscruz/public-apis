module.exports = function ({ readme, indexListIndex }) {
    return readme
        .map((child, i) => {
            if (i <= indexListIndex) return

            if (child.type === 'heading' && child.depth === 3) {
                const name = child.children[0].value
                const rows = readme[i + 1].children

                return { name, rows }
            }
        })
        .filter(table => table)
}
