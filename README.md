# Welcome To Panic Button! #

Production Web App: https://panic-button-c784e.firebaseapp.com/
Production API: https://panic-button-g20.herokuapp.com/

### To setup the application on your local machine... ###

1. Follow the instructions in the client readme.
1.
```
npm install
createdb panic-button
knex --knexfile ./server/knexfile.js migrate:latest
knex --knexfile ./server/knexfile.js seed:run
touch .env
echo JWT_SECRET=$(node -e "require('crypto').randomBytes(48, function(ex, buf) { console.log(buf.toString('hex')) });") >> .env
```


### To deploy to a new Heroku instance... ###
```
heroku create <app-name>
heroku addons:create heroku-postgresql:hobby-dev
git push heroku master
heroku config:set JWT_SECRET=$(node -e "require('crypto').randomBytes(48, function(ex, buf) { console.log(buf.toString('hex')) });")
heroku config:set NODE_ENV="production"
heroku run knex --knexfile ./server/knexfile.js migrate:latest
heroku run knex --knexfile ./server/knexfile.js seed:run
heroku open
```

### To deploy front end to firebase... ###
```
cd /client/www
firebase deploy
```

### To start up your work on your client side env use these commands: ###

gulp:
```
gulp watch
```
firebase
```
firebase serve
```
ionic
```
ionic run ios --livereload --consolelogs
```
