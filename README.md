# google-auth-library-nodejs
	Passport strategy for Google Authentication for Node.js

	This module lets you authenticate using Google in your Node.js applications.
	By plugging into Passport, Google authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express.

google documentation "https://developers.google.com/identity/protocols/OpenIDConnect"

Before creating a new strategy go to googles developer console and get clientID and secret.
 visit : "google developer console"
#Steps 
1 - create new project 
2 - Give a new project name and ID
3 - It'll roughly take a minute to create your new project , once your new project is created it'll redirect you to the application configuration of your app . In the redirected page select APIS AND AUTH -> API's , In the API's page enable the GOogle+ API 
4 - then go to credentials(below APIs), then click on Create New Client Id , and register the domains and callback for your app(configure the domain to be localhost )
5 - Then u'll get your new ID and secret . Use them to create the new Strategy.
# Install
	$ npm install
# Tests
	$ npm start
# 
