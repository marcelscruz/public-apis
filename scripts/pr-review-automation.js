const { context, getOctokit } = require("@actions/github");
const fs = require("fs");

const token = process.env.GITHUB_TOKEN;
const octokit = getOctokit(token);

async function run() {
  try {
    const pr = context.payload.pull_request;
    const { owner, repo } = context.repo;
    const prNumber = pr.number;

    console.log(`Working with repository: ${owner}/${repo}`);
    console.log(`PR number: ${prNumber}`);
    console.log(`PR author: ${pr.user.login}`);
    console.log(`Head repo: ${pr.head.repo.full_name}`);
    console.log(`Base repo: ${pr.base.repo.full_name}`);
    console.log(`Head SHA: ${pr.head.sha}`);
    console.log(`Base SHA: ${pr.base.sha}`);
    console.log(`Head ref: ${pr.head.ref}`);
    console.log(`Base ref: ${pr.base.ref}`);

  const filesChanged = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });

  const comments = [];

  // Check 1: New API links in README.md
  const readmeFile = filesChanged.data.find(
    (file) => file.filename.toLowerCase() === "readme.md"
  );

  if (readmeFile) {
    console.log("README.md modified. Checking for new API links...");
    const newLinks = await checkForNewApiLinks(owner, repo, pr);
    if (newLinks.length > 0) {
      const linkComment =
        newLinks.length === 1
          ? `**API link:** ${newLinks[0]}`
          : [
              "**New API links:**",
              "",
              ...newLinks.map((link) => `- ${link}`),
            ].join("\n");
      comments.push(linkComment);
    }
  }

  // Check 2: Edits to /db folder
  const dbFiles = filesChanged.data.filter((file) =>
    file.filename.startsWith("db/")
  );

  if (dbFiles.length > 0) {
    console.log(
      `DB folder modifications detected in ${dbFiles.length} file(s)`
    );
    const dbWarning =
      "Thanks for your contribution!\n❗️ **Warning:** The `/db` folder is auto-generated, so please do not edit it. Changes related to public APIs should happen in the `README.md` file. Read the [contribution guidelines](https://github.com/marcelscruz/public-apis/blob/main/CONTRIBUTING.md) for more details.";
    comments.push(dbWarning);
  }

  // Post all comments as a single comment
  if (comments.length > 0) {
    const finalComment = comments.join("\n\n---\n\n");

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: finalComment,
    });

    console.log("Comment posted with all checks.");
  } else {
    console.log("No issues found in this PR.");
  }
  } catch (error) {
    console.error("Error in PR review automation:", error);
    // Don't exit with error code to avoid failing the entire workflow
    // Just log the error and continue
  }
}

async function checkForNewApiLinks(owner, repo, pr) {
  try {
    // For pull_request_target, we need to get content from the correct repositories
    // Base content from the target repository (upstream)
    const baseRes = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: "README.md",
      ref: pr.base.sha, // Use SHA instead of ref name
    });

    // Head content from the source repository (could be a fork)
    const headRes = await octokit.rest.repos.getContent({
      owner: pr.head.repo.owner.login,
      repo: pr.head.repo.name,
      path: "README.md",
      ref: pr.head.sha, // Use SHA instead of ref name
    });

    const decode = (res) =>
      Buffer.from(res.data.content, "base64").toString("utf8");
    const baseContent = decode(baseRes);
    const headContent = decode(headRes);

    const baseLinks = new Set(
      [...baseContent.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)].map(
        (m) => m[2]
      )
    );
    const headLinks = new Set(
      [...headContent.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)].map(
        (m) => m[2]
      )
    );

    const newLinks = [...headLinks].filter((link) => !baseLinks.has(link));

    console.log(`Base links found: ${baseLinks.size}`);
    console.log(`Head links found: ${headLinks.size}`);
    console.log(`New links found: ${newLinks.length}`);

    if (newLinks.length > 0) {
      console.log("New links:", newLinks);
    }

    return newLinks;
  } catch (error) {
    console.error("Error checking for new API links:", error);
    return []; // Return empty array on error to avoid breaking the workflow
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
