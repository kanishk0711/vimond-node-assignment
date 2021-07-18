Project Name:
	vimond-node-app
	

Port Information: 
	8040, can be altered from constants file loc: project_root/lib/constants.js


Libraries Used: 
	express: boiler plate and rapid development
	cors: retricting to localhost
	joi: validation 
	node-cache: memory caching
	node-fetch: external URL requests
	
	
Required Commands: 
	$ npm install
	$ npm start
	
	
Project Structure: 	
	The responsibilies are segregated according to the roles:
	/root
	|
	| app.js 		-> Entry Point for our app, contains configs, security, route direction and server details.
	| package.json 	-> project versioning info, scripts and dependencies
	|
	| /lib
			| constants.js 		-> contains all the constants list used in the project
	|
	| /routes
			| index.js 			-> controller, api routes which defines the routes and direction
	|	
	| /service
			| mainService.js 	-> contains business logic to all our routes, except health check
			| commonService.js 	-> contains re-usable services, accessed from mainService only
			|
			| /validation
					| validatorService.js 	-> contains all the validation rules for object parameters and request body
					
					
					
Requests and descriptions:

1. GET /ping
					Info:
						Health check
						
					Returns:
						"pong!"
						
					Status:
						200 : Success

2. GET /version
					Returns: 
						Node version
						
					Status:
						200 : Success
						500 : internal server error
					
3. GET /images?size=2&[offset=5]
					Info:
						Fetch images from external API and filters the desired pagination purpose
						Images data is cached, with TTL:10 secs [all get requests have 10 sec TTL, to alter goto constants.js -> CACHE_TTL]
						
					Validatons:
						Checks for query paramters:
							size: 	should be integer, not null and required
							offset:	optional, but when present - should be integer, if not present: default value ->  0
					
					Returns:
						Image data list
						
					Status:
						200 : Success
						400 : when validation fails
						500 : internal server error

4. GET /Nicholas
					Info:
						For a specific userId [here -> 8, to alter goto constants.js -> SPECIFIED_USER_ID ]
						a.) retrieves user details
						b.) aggregates all posts for that user
						Data is cached, with TTL:10 secs
					
						
					Returns:
						User detail & post list
						
					Status: 
						200 : Success
						409 : multiple users conflict
						500 : internal server error
						
5. GET /Romaguera
					Info:
						Retrieves all the users working at Romaguera group companies
						Later, retrieves all the posts revelant to the users obtained in previous step
						Data is cached, with TTL:10 secs
						
					Returns:
						Post list
						
					Status:
						200 : Success
						500 : internal server error
						
6. POST /todo
					Info:
						Receives request body and makes POST request to external API and serves the response obtained
						New todo-data is cached, with no expiration time-> till session exists.
						
					Validatons:
						Checks for body parameters: Throws 400 status, if validation fails
							id: accepts number, null and "" [keeping in mind - id is auto-generated]
							title: string, not null, min length: 1, max length: 100
							completed: boolean, not null
							
					Returns: 
						todo object with received ID 
						
					Status:
						201 : Created
						400 : when validation fails
						500 : internal server error
						
	
7. GET /sorted-users
					Info:
						Sorts users on basis of their city and filters users whose website domain ends with ['.com','.net','.org']
						Data is cached, with TTL:10 secs
						
					Returns:
						User list
						
					Status:
						200 : Success
						500 : internal server error

8. GET /new-todos
					Info:
						Retrieves all the new todos stored in-memory cache.
						We keep all newly created todo's in cache
						
					Return:
						todo List
						
					Status:
						200 : Success
						
						
I hope the document is readable and easy to understand, apologies for the formatting.