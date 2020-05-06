var should  = require ('should');
var assert  = require ('assert');
var request = require ('supertest');
var app     = require ('../app').app;
var expect  = require('chai').expect;



var User    = require ("../models/user");
var Cart    = require ("../models/cart");
var Order   = require ("../models/order");



var user = {
    'name'      : 'Lebron',
    'password'  : 'password123',
    'firstname' : 'Lebron',
    'lastname'  : 'James',
    'state'     : 'TX',
    'address1'  : '12345 Hollywood Blvd',
    'address2'  : '',
    'city'      : 'Richardson',
    'zipcode'   :  12345
};



// Item must exists to add in the cart
var newItemInCart = {
    "product"   : "5ea643f2e014a24699cae3ad",
    "quantity"  : "1",
    "cartId"    : "5e88d3f5dccd984b4cfdfd36"
};


var order = {
    "user"      : "dfrlkg0agd227sd5448c8df9",	
    "cartId"    : "5e89120a7222755448c8df84",
    "shipping"  : 
    {
        "firstname" : "Test",
        "lastname"	: "User",
        "address1"	: "777 Brockton Avenue",
        "address2"	: "",
        "city"		: "Abington",
        "state"		: "MA",
        "zipcode"	: 12351
    },
    "billing":
    {
        "firstname" : "Test",
        "lastname"	: "User",
        "address1"	: "777 Brockton Avenue",
        "address2"	: "",
        "city"		: "Abington",
        "state"		: "MA",
        "zipcode"	: 12351
    },
    "payment": 
    {
        "name"			: "Test",
        "cardnumber"	: 13436546554,
        "expirationdate": "28/04/2020",
        "cvv"			: 4464
    },
    "totalamount"		: 31.53,
    "estimateddelivery"	: "27/4/2020",
    
    "items"				: [
        {
        "product" : 
        {
            "productDescription" : "iPhone 11 Black 256 GB",
            "price" : 9.99
            
        },
        "quantity" : 2
        },
        {
        "product" : 
        {
            "productDescription" : "Pixel 2XL Black 256 GB",
            "price" : 12.99
            
        },
        "quantity" : 1
        }
    ]
}

var orderId;
var cartId;
var userId;


let rootJwtToken;



let proceed =false;
let CartAdded = false;
let CartFetched = false;
let ProfileInfoFetched = false;
let orderAdded = false;
let priceFetched = false;



describe ('authentication' ,function() {
    after(function(done) {

         User.deleteOne({_id:userId})
         .then(res=>{
             console.log("User deleted!");
         });
         Cart.deleteOne({_id:cartId})
         .then(res=>{
             console.log("Cart deleted!");
         });

         Order.deleteOne({_id:orderId})
         .then(res=>{
             console.log("Dummy Order deleted!");
         });  

        done();
    });


    describe('Signup', function () {
        it('should sign new user up', function(done) {
            request(app)
                .put('/auth/signup')
                .send(user)
                .expect(201)
                .then(res=>{
                    console.log(res.body.message);
                    userId = res.body.userId;
                    proceed = true;
                })
                .catch(err=> {
                    console.log(err);
                })      
                done();         
        });
    });


    let token;
    describe('login', function() {
        var check = function(done) {
            if (proceed == true) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
        
          before(function( done ){
            check( done );
        });
        it('should login a user', function(done) {
            request(app)
                .post('/auth/login')
                .send(user)
                .expect(200)
                .then ((res) => {
                    rootJwtToken = res.body.token;
                })
                done();
        })
    })


    describe('Show User profile information', function() {
        var check = function(done) {
            if (proceed == true && rootJwtToken) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
        
          before(function( done ){
            check( done );
        });
        it ('should show user profile information', function(done) {
            request(app)
            .get('/auth/user-profile')
            .set('Authorization', 'Bearer ' + rootJwtToken)
            .expect(200)
            .then(res=>{
                console.log("______________________________________");
                ProfileInfoFetched = true;
                console.log(res.body);
            })
            done();
        });
    });    


    describe('create order' , function() {
        var check = function(done) {
            if (proceed == true && rootJwtToken && ProfileInfoFetched == true) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
          before(function( done ){
            check( done );
        });

        it ('should create dummy order', function(done) {
            request(app)
                .post('/order/place-order')
                .send(order)
                .expect(201)
                .then(res => {
                    orderId = res.body.order._id;
                    orderAdded = true;
                    console.log("______________________________________");
                    console.log("Order added successfully ");
                })
                .catch(err=> {
                    console.log(err);
                })
                done();
        })
    });


    describe('fetch all products' , function() {
        var check = function(done) {
            if (proceed == true && rootJwtToken && orderAdded ==true) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
          before(function( done ){
            check( done );
        });

        it ('should fetch all products', function(done) {
            request(app)
                .get('/products')
                .expect(200)
                .then(res => {
                    console.log("______________________________________");
                    console.log(res.body);
                    console.log("______________________________________");
                })
                .catch(err=> {
                    console.log(err);
                })
                done();
        })
    });


    describe('fetch single product' , function() {
        var check = function(done) {
            if (proceed == true && rootJwtToken && orderAdded ==true) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
          before(function( done ){
            check( done );
        });

        it ('should fetch a single product', function(done) {
            request(app)
                .get('/products/show-product/5ea643f2e014a24699cae3ad')
                .expect(200)
                .then(res => {
                    console.log("______________________________________");
                    console.log(res.body);
                    console.log("______________________________________");
                })
                .catch(err=> {
                    console.log(err);
                })
                done();
        })
    });    


    describe('add item in user cart' , function() {
        var check = function(done) {
            if (proceed == true && rootJwtToken && orderAdded ==true) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
          before(function( done ){
            check( done );
        });

        it ('should add item in user cart', function(done) {
            request(app)
                .post('/cart/guest-cart/add-item')
                .send(newItemInCart)
                .expect(201)
                .then(res => {
                    cartId = res.body.cart._id;
                    CartAdded = true;
                    console.log("Item added in cart successfully ");
                    console.log("______________________________________");
                })
                .catch(err=> {
                    console.log(err);
                })
                done();
        })
    });


    describe('calculate total price of user cart' , function() {
        var check = function(done) {
            if (proceed == true && rootJwtToken && CartAdded ) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
          before(function( done ){
            check( done );
        });

        it ('calculate total price of user cart', function(done) {
            request(app)
                .get('/cart/get-total-price/'+ cartId)
                .expect(200)
                .then (res => {
                    console.log(res.body);
                    priceFetched = true;
                    console.log("______________________________________");
                })
                .catch(err=> {
                    console.log(err);
                })
                done();
        })
    });


    describe('fetch user cart' , function() {
        var check = function(done) {
            if (proceed == true && rootJwtToken && CartAdded && priceFetched) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
          before(function( done ){
            check( done );
        });

        it ('should fetch user cart', function(done) {
            request(app)
                .get('/cart/guest-cart/'+ cartId)
                .expect(200)
                .then (res => {
                    console.log(res.body);
                    CartFetched = true;
                    console.log("______________________________________");
                })
                .catch(err=> {
                    console.log(err);
                })
                done();
        })
    });       


    describe('' , function() {
        var check = function(done) {
            if (proceed == true && rootJwtToken  && CartFetched) done();
            else setTimeout( function(){ check(done) }, 1000 );
          }
          before(function( done ){
            check( done );
        });

        it ('', function(done) {
            request(app)
                .get('/products')
                .expect(200)
                .then(res => {
                    console.log("______________________________________");
                })
                .catch(err=> {
                    console.log(err);
                })
                done();
        })
    });

});