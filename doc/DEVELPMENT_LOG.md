Hi there!

It is a log of my development process.

I decided to write down all my thoughts and decisions in a log.

Each title is a commit

## 1. Init app (760a0474)

I'm setting up an application comprising both frontend and backend. To speed up the setup, I've considered the following
boilerplates:

- [Vite](https://expressjs.com/en/starter/generator.html)
- [Express Generator](https://vitejs.dev/guide/)
- [NPM Workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces?v=true)

## 2. Backend Code Refresh (e4433ee8)

About `npx express-generator`: I noticed it was a bit outdated, primarily utilizing older syntax (like CommonJS). To
modernize the codebase,
I updated it to leverage ES6 syntax and removed unnecessary (for me) libs and files.

## 3. Add backend MVP

I quickly made a draft working code for the backend in few files.

![img.png](img.png)

![img_1.png](img_1.png)

![img_2.png](img_2.png)

Funny, it's a Nodejs task, but the frontend work is twice as much 😅
I made a plan for myself, and it looks exactly like this.
