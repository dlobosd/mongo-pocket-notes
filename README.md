# Mongo Pocket Notes

Tiny JavaScript command-line notebook backed by MongoDB.
Add a note and list the 20 newest notes.

## Setup

Requires Node.js 22+ and a running MongoDB instance (local or Atlas).

1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. Set your MongoDB connection string and database name in `.env`.
   Never commit credentials.

```sh
npm start -- add "Study French for 20 minutes"
npm start -- list
npm test
```

Notes contain text (1–1000 characters) and a creation date.
Invalid commands are rejected before connecting. Connections close after each command.
This is a local learning CLI, without a web server or user accounts.

Driver reference: https://www.mongodb.com/docs/drivers/node/v6.x/
