const { context, getOctokit } = require("@actions/github");
const fs = require("fs");

const token = process.env.GITHUB_TOKEN;
const octokit = getOctokit(token);

async function run() {
  const pr = context.payload.pull_request;
  const { owner, repo } = context.repo;
  const prNumber = pr.number;

  const filesChanged = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });

  const readmeFile = filesChanged.data.find(
    (file) => file.filename.toLowerCase() === "readme.md"
  );
  if (!readmeFile) {
    console.log("README.md not modified. Skipping.");
    return;
  }

  const baseRes = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: "README.md",
    ref: pr.base.ref,
  });

  const headRes = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: "README.md",
    ref: pr.head.ref,
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

  if (newLinks.length === 0) {
    console.log("No new links found.");
    return;
  }

  const commentBody = [
    "🔍 **New API link:**",
    "",
    ...newLinks.map((link) => `- ${link}`),
  ].join("\n");

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: commentBody,
  });

  console.log("Comment posted.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
