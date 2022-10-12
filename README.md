# Watchlist API

To start this API, create a `.env` file in the root of this folder with this content

```
NODE_ENV="development"
DATABASE_USERNAME="root"
DATABASE_PASSWORD=""
```

Update the username and password with the credentials of your local database.

You can also extend the .env file with these configurations, only if the database host/port are different than our default.

```
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

## How to start
First install all the required packages with `yarn install`

Run the app with `yarn start`.

Run the tests with `yarn test` if you want to compile a coverage file use `yarn test:coverage`

## Known problems

* Unit test movies don't work unless the debugLog in the methods are commented if they aren't it will complain about the logger not existing.
