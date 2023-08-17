## Chat App

![result.gif](doc%2Fresult.gif)

<details>

<summary>Description (Click here)</summary>

> ### Test application
>
> The end result is expected to be a primitive chat application. The main goal is to demonstrate the skills needed to
> build a basic real-time error-resilient distributed system with two components - frontend and backend. In terms of
> requirements not outlined here, best practices should be followed. Simple is better than complicated.
>
> ### Expected knowledge
>
> 1. Modern Javascript
> 2. Node.js
> 3. Express
> 4. WebSockets & related libraries (if you choose to use websockets rather than eg. long-polling) 5. React
> 5. Webpack, Rollup or Vite
>
> ### Restrictions
>
> 1. Avoid using third-party dependencies if the same effect can be reasonable achieved without those (eg. Create React
>    App, Moment).
> 2. Prefer lower-level dependencies over higher-level dependencies (eg. ws over Socket.IO).
>
> ### Backend
>
> 1. Written in native ES6+ (no TypeScript, transpilation, etc.)
> 2. No authentication and authorization is needed.
> 3. The only data structure is a message with following fields:
>    - user’s display name;
>    - text content;
>    - server-side timestamp.
> 4. Data could be stored in memory.
> 5. Provides an API (ie HTTP and/or WebSocket endpoints) to
>    - add a message
>    - receive initial set of (old) messages
>    - subscribe to new messages
> 6. Must be resilient against race conditions and connectivity/availability problems. No messages should be
>    accidentally lost or shown more than once, out of order, etc.
>
> ### Frontend
>
> 1. Could be written in TypeScript, since transpilation is unavoidable with JSX anyway.
> 2. Must be based on React.
> 3. Design is not important as long as it’s not confusing or broken.
> 4. Displays a list of all known messages ordered chronologically (new messages should always be appended regardless of
>    their time).
> 5. Time should be displayed in the browser’s time zone in a sensible format.
> 6. Displays a form for the user to send a new message. User display name field could either be part of the new message
>    form or be set in any other way.
> 7. Must have sensible error handling (e.g. when fetching messages, sending a new message). No unhandled exceptions or
>    promise rejections are allowed.
> 8. Must receive new messages incrementally. Polling the whole message list is not allowed.

</details>

## How I developed this project

If you have come here, I hope you will be interested to see how I developed the code:
[DEVELOPMENT_LOG.md](./doc/DEVELOPMENT_LOG.md)

## How to run this project

```bash
# install dependencies
npm install

# start frontend
npm run dev -w frontend

# start backend
npm run start -w backend
```

Open: http://localhost:5173/

## Docker

```bash
docker-compose up
```

Open: http://localhost:3000/
