
##Installation instructions:

1. install node
2. install npm
3. install pm2
```
    > npm install pm2 -g
    > pm2 startup
```
4. clone repo
```
    > mkdir /opt/
    > cd /opt/
    > git clone https://github.com/skyquake1/slackchart.git
```
5. install modules
```
    > cd /opt/slackchart
    > npm install
```
6. pm2 configuration
```
    > cd /opt/slackchart
    > cp pm2-cnf-default.json pm2-cnf.json
    > nano pm2-cnf.json
```
7. .env configuration
```
    > cd /opt/slackchart
    > cp .env.example .env
    > nano .env
```
Env variables:
**HTTP_FRONT_PORT:** front http server port

**HTTP_BACKEND_PORT:** backend http server port

**HTTP_STATIC_URL:** url to the static data

**HTTP_STATIC_PATH:** local path to the static data

**GARBAGE_COLLECTOR_SCHEDULE:** cron schedule for run garbage collector to remove old images

**SLACK_APP_ID:** Slack app id

**SLACK_CLIENT_ID:** Slack client id

**SLACK_CLIENT_SECRET:** Slack client secret key

**SLACK_CLIENT_SIGNING_SECRET:** Slack client secret key sign

**SLACK_VERIFICATION_TOKEN:** Slack verifiration token

**SLACK_ACCESS_TOKEN:** Slack acc token

***insert App Credentials*** and save file



##Running

*start:*

    > pm2 start /opt/slackchart/pm2-cnf.json && pm2 save

*restart:*

    > pm2 restart cba-ax-chart-slack-bot && pm2 save

*stop:*

    > pm2 stop cba-ax-chart-slack-bot && pm2 save






