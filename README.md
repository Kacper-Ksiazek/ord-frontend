# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Setup

This project depends on the API types package `@kacper-ksiazek/ord-api-types`, which is
published to **GitHub Packages** (registry `https://npm.pkg.github.com`). GitHub Packages
requires authentication even for read access, so you must provide a token **before** running
the install step.

1. Create a personal access token on GitHub with read access to packages:
   - **Fine-grained PAT** with permission `Packages: Read-only`, or
   - **Classic PAT** with scope `read:packages`.
2. Expose it as the `GITHUB_TOKEN` environment variable. Either:
   - copy `.env.example` to `.env` and set `GITHUB_TOKEN=<your-token>` (the `.env` file is
     git-ignored), and/or
   - export it in your shell: `export GITHUB_TOKEN=<your-token>`.

   The `.npmrc` in the repo root reads this token via `${GITHUB_TOKEN}`, so without it
   `bun install` (or `npm install`) will fail to download the API types package.
3. Install dependencies:

```sh
bun install
```

## Developing

Once you've set up `GITHUB_TOKEN` and installed dependencies with `bun install`, start a
development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
