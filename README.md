# Eventine

Mirror of Eventine project repo from GitLab.

## What is it

A big event management platform for managing event on the spot made with purpose of avoiding critical situations and simplifying communication between organizators and volounteers. This codebase was developed from early June up to early October.

I was mostly responsible for backend and orchestrating a mini team of developers, as well as part of business strategy, and designing early mockups of mobile app.

## Why did it fail

Everybody had personal issues. After all, maybe high schoolers aren't supposed to run startups (ツ)

## Technological stack

Whole backend is written using node.js Express framework, orchestrated on Google Cloud Platform using Kubernetes and Docker, with basic setup of Gitlab CI/CD pipeline.
  
## How to run it

First, you have to create a firebase account and download private key, set it in root directory and change .env file FIREBASE_PRIVATE_KEY value to full name of that file.

Then, you have three different ways of running the project:
1) if you want to simulate exact server behaviour, you can run it using kubernetes and minikube using appropiate script from scripts/ folder
2) you can use docker-compose script which is located in docker/dev folder
3) set it up on your own - just set up MongoDB listening on port 27017 and type npm install, npm start!

## How to run tests and lint

Tests are written with Mocha.js library so you have to install it first, then just type ```npm test```.

Linter is included into dependecies, use it with commands ```npm run lint``` and ```npm run lint:fix```

## What I would change / pseudo to-do list

Improve code coverage for project for sure. I also regret the choice of choosing no-sql database as it made the models extremely big, and made the whole architecture way slower, instead of it I would use Sequelize with Postgres.

Also I would make sure to get whole feature list, and not listen that much to potential customers, as unexpected feature changes and misinterpretation forced me to make architecture do stuff that it wasn't originally meant to do.

## Documentation

[Swagger Docs](https://app.swaggerhub.com/apis/dragt12/KalejdoskopAPI/2.0.0)

Every controller action is documented by JSDoc, and there are also comments to explain weird choices I made to be able to simplify some things.