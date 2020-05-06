# Ecommerce Store
(note: node_module file is not in git repository so you need to npm install)

Getting started:
1. Install ReactJS, NodeJS, ExpressJS
2. Create MongoAtlas Account
3. Install VSCode to run code.
4. Install Chrome browser and WebDev Tool
5. For Mac, also do this:  https://medium.com/flawless-app-stories/gyp-no-xcode-or-clt-version-detected-macos-catalina-anansewaa-38b536389e8d
6. Open the backend and frontend folders in separate VScode windows. 
7. Run npm install in backend, then npm install in frontend. This should add node_module folder to each. 
8. Update your MongoAtlas cluster URL to backend app.js file.
9. Run npm start in backend, then npm start in frontend. Make sure chrome is open. Should automatically load webpage. 

How To Add Products:
1. Go to backend > seeds > products.js 
2. add desired products 
3. uncomment lines 12-13 in backend app.js
4. do npm start again. This will update the products in the database and website. 
5. recomment lines 12-13 in backend app.js

How to run unit test:
1. Make sure the product id's on line 31 and 262 in app.test.js backend, match the product id in the database products table.
2. Make sure lines 12-13 are commented in app.js backend.
3. Clear out all the tables in the database except the products table. (Also do this if website is not working properly).
4. Run npm test. 

