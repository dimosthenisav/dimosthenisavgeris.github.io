---
title: "I Moved My Blog Off Notion in a Weekend"
description: "Why I rebuilt dimosthenisavgeris.com as a static Astro site on GitHub Pages, and why the real win is publishing a thought in under ten minutes."
date: 2026-09-10
tags: ["product", "AI"]
cover: "./01-cover.webp"
---

For two years my blog ran on Notion behind super.so. It worked. I wrote in Notion, super.so turned it into a website, I paid a monthly fee and never thought about it.

Then I thought about it.

The writing was mine but the site was not. I could not see the HTML. I could not change how a page rendered without paying for a higher tier. If super.so disappeared, my blog disappeared with it. For something I want to keep for a decade, that is a bad setup.

So over a weekend I moved it.

## What I picked

The site is now the [astro-narrow](https://github.com/tom2almighty/astro-narrow) theme, close to untouched. One narrow reading column, fluid typography, a palette that mixes from three colors. Astro, Tailwind, no React, no framework islands. Plain files on disk.

It deploys to GitHub Pages. I push to `main`, a GitHub Action builds it, the site updates. No server, no subscription, no dashboard. The domain points straight at GitHub's IPs.

## What the migration took

The hard part was not the site. It was the 29 posts sitting in a Notion database.

I had Claude Code pull each one through the Notion API into a folder of Markdown, one folder per post, images downloaded and resized locally. Notion's image URLs expire after five minutes, so the script had to grab them immediately or lose them. The big slide-deck posts became image galleries. Tags carried over from the database's multi-select.

Then covers, a favicon rebuilt as a vector of my logo, a home card that reuses my portrait, and cutting the projects section from the nav. A weekend of small edits.

## Why it was worth it

One reason above all the others: I can go from a rough thought to a published post in under ten minutes.

The blog is Markdown in a Git repo now, and Claude Code lives in that repo. I paste in a messy note or talk through an idea out loud, Claude drafts it in my voice, drops it in the right folder with the frontmatter filled in, and pushes. The GitHub Action does the rest. No copy-paste into Notion, no fixing formatting, no separate publish step to wait on.

This post is the proof. I described it to Claude, it wrote a draft, I edited two paragraphs, and it went live.

Owning the stack is nice. Cancelling the subscription is nice. But the real change is that the distance between having something to say and it being live is almost zero. That is the thing that makes me write more.

Until the next one, keep iterating and stay curious.
