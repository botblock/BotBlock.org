# Deploying the project

Deploying the project can only be carried out by BotBlock team members that have access to the staging & production web
servers, which use Plesk as the management portal.

## Staging

### Git

To deploy to staging, the `node` branch will need to be pushed to the remote `staging` branch.

 - To push node to the remote staging: `git push origin node:staging -f`

### Updating

Once done, this can then be pulled into Plesk, NPM install run, database migrations run & the Node app restarted.

### Testing

Once the latest changes are live on staging, the full test suite should be run through the website by logging in with
Discord, heading to the Tests page and running the suite.

# Production

### Git

To deploy to production, you should push the latest staged commit from `staging` to the remote `production` branch.
Ensure that you have pulled down the latest `staging` branch from the remote before pushing to `production`.

 - To delete your local staging copy: `git branch -d staging`
 - To checkout latest remote staging: `git fetch && git checkout staging`
 - To push staging to the remote production: `git push origin staging:production`

A single command to push the latest remote staging to the remote production branch:
`git branch -d staging && git fetch && git checkout staging && git push origin staging:production && git checkout node`

### Updating

Once done, this can then be pulled into Plesk, NPM install run, database migrations run & the Node app restarted.

### Testing

Once the latest changes are live on production, the full test suite should be run through the website by logging in with
Discord, heading to the Tests page and running the suite.
