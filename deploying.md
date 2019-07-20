# Development

All development will be carried out in `node` and subsequent feature branches for pull requests.

# Staging

To deploy to staging, the `node` branch will need to be pushed to the remote `staging` branch.
Once done, this can then be pulled into Plesk, NPM install run & the Node app restarted.

 - To push node to the remote staging: `git push origin node:staging`

# Production

To deploy to production, you should push the latest staged commit from `staging` to the remote `production` branch.
Ensure that you have pulled down the latest `staging` branch from the remote before pushing to `production`.
Once done, `production` can be pulled in Plesk, installed & restarted.

 - To delete your local staging copy: `git branch -d staging`
 - To checkout latest remote staging: `git fetch && git checkout staging`
 - To push staging to the remote production: `git push origin staging:production`
