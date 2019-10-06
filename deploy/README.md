# Deploying the project

Deploying the project can only be carried out by BotBlock team members that have access to the staging & production web
servers, which use Plesk as the management portal.

# Staging

## Automatic

To automatically deploy the latest commit from your local branch (assuming you have access to deploy to staging),
you can simply run `npm run deploy:staging`.

## Manual

### Git

To deploy to staging, your local branch will need to be pushed to the remote `staging` branch.

 - To push your branch to the remote staging: `git push origin <local branch name>:staging -f`

### Updating

Once done, this can then be pulled into Plesk, NPM install run, database migrations run & the Node app restarted.

## Testing

Once the latest changes are live on staging, the full test suite should be run through the website by logging in with
Discord, heading to the Tests page and running the suite.

# Production

## Automatic

To automatically deploy the remote staging branch to production (assuming you have access to deploy to production),
you can simply run `npm run deploy:production`.

## Manual

### Git

To deploy to production, you should push the latest staged commit from `staging` to the remote `production` branch.
Ensure that you have pulled down the latest `staging` branch from the remote before pushing to `production`.

 - To delete your local staging copy: `git branch -D staging`
 - To checkout latest remote staging: `git fetch && git checkout staging`
 - To push staging to the remote production: `git push origin staging:production -f`

A single command to push the latest remote staging to the remote production branch:
`git branch -D staging && git fetch && git checkout staging && git push origin staging:production -f && git checkout node`

### Updating

Once done, this can then be pulled into Plesk, NPM install run, database migrations run & the Node app restarted.

## Testing

Once the latest changes are live on production, the full test suite should be run through the website by logging in with
Discord, heading to the Tests page and running the suite.
