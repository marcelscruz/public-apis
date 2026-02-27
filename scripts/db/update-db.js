const fs = require('fs')
const remarkParse = require('remark-parse')
const unified = require('unified')

const formatCategories = require('../../utils/db/format-categories')
const formatJson = require('../../utils/db/format-json')
const formatResources = require('../../utils/db/format-resources')
const groupRowContent = require('../../utils/db/group-row-content')
const separateTables = require('../../utils/db/separate-tables')
const writeToFile = require('../../utils/db/write-to-file')

async function updateDB() {
    try {
        // Correct usage of readFileSync (no callback)
        const readme = fs.readFileSync('./README.md', 'utf-8')

        const parsedReadme = unified()
            .use(remarkParse)
            .parse(readme).children

        const indexListIndex = parsedReadme.findIndex(
            child => child.type === 'list'
        )

        // Create resources list
        const separatedTables = separateTables({
            readme: parsedReadme,
            indexListIndex,
        })

        const tablesWithGroupedRowContent = groupRowContent(separatedTables)
        const formattedContent = formatResources(tablesWithGroupedRowContent)

        await writeToFile({
            data: formatJson(formattedContent),
            filePath: './db/resources.json',
        })

        // Create categories list
        const categories = parsedReadme[indexListIndex].children.map(
            category =>
                category.children[0].children[0].children[0].value
        )

        const categoriesList = formatCategories(categories)

        await writeToFile({
            data: formatJson(categoriesList),
            filePath: './db/categories.json',
        })

        console.log('Database files created successfully.')

    } catch (error) {
        console.error('Error creating DB files:', error)
        process.exit(1)
    }
}

updateDB()
