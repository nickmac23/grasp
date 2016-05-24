# Welcome To Panic Button! #

### To setup the application on your local machine... ###

1. Follow the instructions in the client readme.
1. 
```
npm install
knex --knexfile ./server/knexfile.js migrate:latest
knex --kenxfile ./server/knexfile.js seed:run
touch .env
echo JWT_SECRET=$(node -e "require('crypto').randomBytes(48, function(ex, buf) { console.log(buf.toString('hex')) });") >> .env
```


### To deploy to a new Heroku instance... ###
```
heroku create <app-name>
heroku addons:create heroku-postgresql:hobby-dev
git push heroku master
heroku set:JWT_SECRET=$(node -e "require('crypto').randomBytes(48, function(ex, buf) { console.log(buf.toString('hex')) });")
heroku set:NODE_ENV="production"
heroku open
```

### To deploy front end to firebase... ###
```
cd /client/www
firebase deploy
```
