# Watchlist API

Backend for my front-end project you can find by following the link below

[Link front-end](https://github.com/Bobobaal/Frontend-project)

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

## Screenshot Swagger, werkt met authorisatie
![image](https://user-images.githubusercontent.com/15947020/195469304-3da97f6a-309a-466d-8b21-65d1f0252035.png)
