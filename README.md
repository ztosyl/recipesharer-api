# Share-A-Recipe: API

## Links
[Front-End App](https://ztosyl.github.io/recipesharer-client/)
[API](https://evening-shore-06537.herokuapp.com)

## Technologies Used
Express.js was used for routing, and I used a MongoDB database with Mongoose. I also used passport for authentication, cors for testing and some custom errors for our specific needs. For testing API communication, I used curl.

## Unsolved Problems

### Ingredients
At first, I wanted to make ingredients their own separate models, but that proved too complicated to implement on the front end, specifically for recipe creation. This caused limitations in how the data could be input by the user and still come out looking correct. I'd like to be able to implement an Ingredient schema to be used with the recipe in the future.

### Ratings
I also would like to create a Ratings schema, which would allow me to keep track of the authors of individual ratings, and thus would allow for some flexibility in how to use them. For example, an issue I had on the front end is that one user could repeatedly spam ratings for a recipe and the program is unable to stop them, and adding an author to ratings would help with that.

### Uploads
Lastly, I'd like to integrate the capability for users to attach photo uploads to their recipes. In order to do so I'd have to configure my heroku with my AWS keys, and create new schema for photo uploads and integrate them with Recipes as well.

## Planning

I started with the database, before moving on to create a front-end app that worked best within my database. The user was set up on the template, so I begun by creating the recipe schema.

### Recipes
As I said above, I attempted at first to relate ingredients and users to recipes but when it came time to create recipes it was difficult to integrate the two into one form in a way seamless to the user. So, I created a recipe with an ingredient array, an author with a reference to a user, an array of steps, a meal type, a difficulty, and a title.

For recipe routes, I wanted to be able to perform all CRUD actions on them. So first I wrote GET (index/show) and POST routes, and once I had create working I was able to test the GETs. I also wrote curl scripts for all of these. Due to the long nature of some of the keys (for ex. steps and ingredients), I hard coded data into curl scripts to create recipes as opposed to entering them in the terminal. After this, I made a delete function as well.

As mentioned in my client README for this project, I wanted an update function for my front-end that would allow a user to only input some fields and still have it be a valid update that provides the desired result. However, I felt that this would be best done on the front end, so the back-end version of my .patch for recipes requires a full recipe in order to complete.

### Comments
After I had recipes working on both front and back end, I integrated comments into the program. I created a comment schema with a title, body and author, and then added an array of comments to each recipe. I created comment routes; I decided that for comments the two that made sense were index and create, so those are the ones that are possible. With this database, you can index all comments from one recipe, or post a comment to a recipe.

### Ratings
To implement ratings, I had to come up with a way to add them from the back end after the fact. In theory, this could be done with a .patch, but I found it cleaner to create a new route in recipe_routes just for ratings. This route just pushed a rating onto the ratings array of the recipe indicated.

## Entity Relationship Diagram

[ERD](https://i.imgur.com/zSZw2U5.jpg)
