# API

This repository auto-generates the `/db` folder after each commit to `main`. The folder includes two files:

`categories.json` - A list of all categories

`resources.json` - A list of all APIs

You can then use [Octokit](https://github.com/octokit) to fetch the data from the `db` folder.

Here's a minimal snippet on how to accomplish that:

```ts
import { Octokit } from 'octokit'

async function fetchResources(file: string) {
    const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN })

    const { data } = await octokit.rest.repos.getContent({
        owner: 'marcelscruz',
        repo: 'public-apis',
        path: `/db/${file}.json`,
    })

    if (data.download_url) {
        const result = await fetch(data.download_url)

        if (!result.ok) {
            throw new Error(`Unexpected response ${result.statusText}`)
        }

        return await result.json()
    } else {
        throw new Error('Download URL not found')
    }
}
```

The response will be an object with the following structure:

`categories.json`:

```ts
{
    "count": number,
    "entries": [
        {
            "name": string,
            "slug": string
        }
    ]
}
```

`resources.json`:

```ts
{
    "count": number,
    "entries": [
        {
            "API": string,
            "Auth": string,
            "Category": string,
            "Cors": string,
            "Description": string,
            "HTTPS": boolean,
            "Link": string,
        }
    ]
}
```
