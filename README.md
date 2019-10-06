# BotBlock.org

## Getting Started

### Config File

Copy the example config file to `config.js` at the root of the project.
For development, you may want to set the port to `3000` instead of `80`.
Please make sure to fill out all the required config data for the Discord integration.

### Dependencies

We use Node.js 10+ for the project, so all our dependencies are managed from the `package.json` file and can be
installed with NPM by running `npm install`.

We have decided that the dependency lock file (`package-lock.json`) won't be version controlled for this project.
If we ever encounter and issue with dependency versioning across environments, we might change this.

### Setup Database

#### Create Database

The first thing to do is create your database and a blank schema with a name of your choosing.
In production, we use MySQL and a schema named `botblock`.

Once you have this setup, please input the database config data into the `config.js` file.

#### Create Structure

To initialise the full structure in your database and ensure it is up-to-date with what the project expects,
we use Knex's migrations feature.

Please run `npm run db:migrate` to run all pending database migrations, which includes the initial migration to setup
the DB structure.

#### Seed Data

To get your database populated with data, you can use the seed data that we have provided in the repository.
This data is periodically updated with an export of the live production data.

Warning! Running the seed script will wipe the tables before introducing the provided seed data.

To run the seed script, use `npm run db:seed`.

## Development

### Web Server

To run the web server for development, use `npm run dev`.
This will start the application in watching mode so when a file is changed it will restart the app automatically.

### SCSS

To build the styling for the site once, you can use `npm run css:build`.

However, if you are working on the styling, you can use the watch mode where the styles will be rebuilt whenever a SCSS
file is updated. To use this, run `npm run css:watch`.

## Testing

Tests are super important!
They allow us to validate any changes that are made before we deploy to staging and production.

Please make sure you write tests for any new code you add to the project, in the `tests` directory, following the same
file structure as in `src`.

To run the full test suite, ensure that the web server is running first using `npm run start` or `npm run dev`.
You can then run the test suite, which uses mocha, by running `npm run test`.

## Updating

Keeping your copy of the project up-to-date is important when working on new features.
Once you have pulled down the latest changes from GitHub (using `git pull`), make sure to run any pending database
migrations by using `npm run db:migrate`.

If you wish to ever reset the data in your database to a recent copy of production and wipe any data changes you've
made, you can always reseed the database by using `npm run db:seed`.
