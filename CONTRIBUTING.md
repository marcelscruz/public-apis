# Contributing to public-apis

> ❗️ The `/db` folder is auto-generated, so please **_do not_** edit it. Changes related to public APIs should happen on the `README.md` file.

> While the masses of pull requests and community involvement are appreciated, some pull requests are opened purely to
> market a product rather than to share a usable API. This list is not a billboard: every entry must point at a publicly
> documented, self-serve API that others can actually connect to. Paid, freemium and free APIs are all equally welcome -
> "public" means anyone can sign up and call it, not that it costs nothing.
>
> Thanks for understanding! :)

## What we accept

Before submitting, make sure the API meets all of the following criteria:

-   **Any use case** — the product can serve any audience or subject matter. What matters is that it exposes an API others can connect to
-   **Free or paid** — "public" means anyone can sign up and call it, not that it costs nothing. Paid and freemium APIs are welcome
-   **Self-serve** — no waitlists, betas behind closed signups, "coming soon" products, partner-approval processes, or "contact sales" gates. A stranger must be able to go from the docs to a working call on their own
-   **Publicly reachable and documented** — the API must be publicly reachable right now and have proper documentation. If its Auth, HTTPS and CORS behaviour cannot be determined from the docs, it does not qualify
-   **Main product only** — the submission must be a product in its own right; internal tools or features of a larger product are not accepted. The API itself does not have to be the product's main offering
-   **Custom domain required** — APIs hosted on shared subdomains (`vercel.app`, `netlify.app`, `herokuapp.com`, `github.io`, `pages.dev` and similar) are not accepted
-   **Clean URLs** — the URL must not contain query parameters (anything after `?`); link to the plain documentation page instead
-   **Quality bar** — low-effort projects are not accepted

Apps, libraries, CLIs, SDKs and websites with no connectable API do not belong here. If your product is a tool developers use to build software, it belongs in [dev-resources](https://github.com/marcelscruz/dev-resources) — and if it *also* exposes a public API, it belongs in **both**; the two directories overlap on purpose, and a listing in one is not a duplicate of the other.

Submissions are reviewed by an automated reviewer first — a bot account may comment on, approve, or close your pull request — and by the maintainer for the final merge.

## Formatting

Current API entry format:

| API                                  | Description        | Auth                                     | HTTPS                       | CORS                                                                                    |
| ------------------------------------ | ------------------ | ---------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| API Title(Link to API documentation) | Description of API | Does this API require authentication? \* | Does the API support HTTPS? | Does the API support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)? \* |

Example entry:

```
| [NASA](https://api.nasa.gov) | NASA data, including imagery | No | Yes | Yes |
```

The URL must start with `http://` or `https://`.

Currently, the only accepted inputs for the `Auth` field are as follows:

-   `OAuth` - _the API supports OAuth_
-   `apiKey` - _the API uses a private key string/token for authentication - try and use the correct parameter_
-   `X-Mashape-Key` - _the name of the header which may need to be sent_
-   `No` - _the API requires no authentication to run_
-   `User-Agent` - _the name of the header to be sent with requests to the API_

Currently, the only accepted inputs for the `CORS` field are as follows:

-   `Yes` - _the API supports CORS_
-   `No` - _the API does not support CORS_
-   `Unknown` - _it is unknown if the API supports CORS_

_Without proper [CORS configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) an API will only be usable server side._

After you've created a branch on your fork with your changes, it's time to [make a pull request][pr-link].

_Please follow the guidelines given below while making a Pull Request to the Public APIs_

## Pull Request Guidelines

-   Never put an update/new version of an API that is already listed, the old version of the API gets deprecated.
-   Continue to follow the alphabetical ordering that is in place per section.
-   Each table column should be padded with one space on either side.
-   The Description should not exceed 100 characters.
-   If an API seems to fall into multiple categories, please place the listing within the section most in line with the services offered through the API. For example, the Instagram API is listed under `Social` since it is mainly a social network, even though it could also apply to `Photography`.
-   Add one link per Pull Request.
-   Make sure the PR title is in the format of `Add Api-name API` _for e.g._: `Add Blockchain API`
-   Use a short descriptive commit message. _for e.g._: ❌`Update Readme.md` ✔ `Add Blockchain API to Cryptocurrency`
-   Search previous Pull Requests or Issues before making a new one, as yours may be a duplicate.
-   Don't mention the TLD(Top Level Domain) in the name of the API. _for e.g._: ❌Gmail.com ✔Gmail
-   Please make sure the API name does not end with `API`. _for e.g._: ❌Gmail API ✔Gmail
-   Please make sure the API has proper documentation.
-   Keep the description under 160 characters so it fits the listing card. Longer descriptions are automatically shortened by our reviewer, kept as close to the original as possible while retaining the most important information.
-   Please make sure you squash all commits together before opening a pull request. If your pull request requires changes upon review, please be sure to squash all additional commits as well. [This wiki page][squash-link] outlines the squash process.
-   Target your Pull Request to the `main` branch of the `public-apis`

Once you’ve submitted a pull request, the collaborators can review your proposed changes and decide whether or not to incorporate (pull in) your changes.

### Pull Request Pro Tips

-   [Fork][fork-link] the repository and [clone][clone-link] it locally.
    Connect your local repository to the original `upstream` repository by adding it as a [remote][remote-link].
    Pull in changes from `upstream` often so that you stay up to date and so when you submit your pull request,
    merge conflicts will be less likely. See more detailed instructions [here][syncing-link].
-   Create a [branch][branch-link] for your edits.
-   Contribute in the style of the project as outlined above. This makes it easier for the collaborators to merge
    and for others to understand and maintain in the future.

### Open Pull Requests

Once you’ve opened a pull request, a discussion will start around your proposed changes.

Other contributors and users may chime in, but ultimately the decision is made by the collaborators.

During the discussion, you may be asked to make some changes to your pull request.

If so, add more commits to your branch and push them – they will automatically go into the existing pull request. But don't forget to squash them.

Opening a pull request will trigger a build to check the validity of all links in the project. After the build completes, **please ensure that the build has passed**. If the build did not pass, please view the build logs and correct any errors that were found in your contribution.

_Thanks for being a part of this project, and we look forward to hearing from you soon!_

[branch-link]: http://guides.github.com/introduction/flow/
[clone-link]: https://help.github.com/articles/cloning-a-repository/
[fork-link]: http://guides.github.com/activities/forking/
[oauth-link]: https://en.wikipedia.org/wiki/OAuth
[pr-link]: https://help.github.com/articles/creating-a-pull-request/
[remote-link]: https://help.github.com/articles/configuring-a-remote-for-a-fork/
[syncing-link]: https://help.github.com/articles/syncing-a-fork
[squash-link]: https://github.com/todotxt/todo.txt-android/wiki/Squash-All-Commits-Related-to-a-Single-Issue-into-a-Single-Commit
