/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function (req, res) {
    var result = {
      admin: req.session.user
    };

    return res.view('admin/admin.ejs', result);
  },



	product: function (req, res) {
    var result = {
      admin: req.session.user
    };
    var skip = 0;
    var page = 1;

    if ( req.query.hasOwnProperty('page') ){
      skip = (req.query.page - 1) * 10;
      page = req.query.page;
    }

    var queryOptions = {
      where: {},
      skip: skip,
      limit: 10,
      sort: 'createdAt DESC'
    };

    result.page = page;

    async.waterfall([
      function GetTotalCount (next) {
        Product.count(function (err, num) {
          if (err) return next (err);

          result.pages = [];

          for ( var i = 0, count = parseInt(num/queryOptions.limit); i <= count; i++ ) {
            result.pages.push(i+1);
          }

          return next(null);
        });
      },

      function GetProducts (next) {
        Product.find(queryOptions, function (err, products) {
          if (err) next (err);

          result.products = products;

          return next(null);
        });
      },

      function GetEditProduct (next) {
        if ( !req.params.hasOwnProperty('id') ) {
          return next(null);
          return;
        }

        Product.findOne(req.params.id, function (err, product) {
          if (err) next (err);
          result.edit = product;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);


      result.templateToInclude = 'adminProductManager';



      return res.view('admin/menu.ejs', result);
    });
  },

  order: function (req, res) {
    var result = {
      admin: req.session.user
    };
    var skip = 0;
    var page = 1;

    if ( req.query.hasOwnProperty('page') ){
      skip = (req.query.page - 1) * 10;
      page = req.query.page;
    }

    var queryOptions = {
      where: {},
      skip: skip,
      limit: 10,
      sort: 'createdAt DESC'
    };

    result.page = page;

    async.waterfall([
      function GetTotalCount (next) {
        Order.count(function (err, num) {
          if (err) return next (err);

          result.pages = [];

          for ( var i = 0, count = parseInt(num/queryOptions.limit); i <= count; i++ ) {
            result.pages.push(i+1);
          }

          return next(null);
        });
      },

      function GetOrders (next) {
        Order.find(queryOptions, function (err, orders) {
          if (err) next (err);

          result.orders = orders;

          return next(null);
        });
      },

      function GetEditProduct (next) {
        if ( !req.params.hasOwnProperty('id') ) {
          return next(null);
        }

        Order.findOne(req.params.id, function (err, order) {
          if (err) next (err);
          result.edit = order;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);


      result.templateToInclude  = 'adminOrderManager';
      // res.json(result);
      return res.view('admin/menu.ejs', result);
    });
  },

  
  
  
  user: function (req, res) {
    var result = {
      admin: req.session.user
    };
    var skip = 0;
    var page = 1;

    if ( req.query.hasOwnProperty('page') ){
      skip = (req.query.page - 1) * 10;
      page = req.query.page;
    }

    var queryOptions = {
      where: {},
      skip: skip,
      limit: 10,
      sort: 'createdAt DESC'
    };

    result.page = page;

    async.waterfall([
      function GetTotalCount (next) {
        User.count(function (err, num) {
          if (err) return next (err);

          result.pages = [];

          for ( var i = 0, count = parseInt(num/queryOptions.limit); i <= count; i++ ) {
            result.pages.push(i+1);
          }

          return next(null);
        });
      },

      function GetUsers (next) {
        User.find(queryOptions).populate('orders').exec(function (err, users) {
          if (err) return next (err);

          result.users = users;

          return next(null);
        });
      }
    ], function (err) {
      if (err) return res.serverError(err);

      
      // we add the name of the template to include 
      
      result.templateToInclude = 'adminUserManager'; 
      
      return res.view('admin/menu.ejs', result);
    });
  },
  
  
  
  
  productCreate: function (req, res){




    Product.create({name:'Walter Jr', price: 10}, function (err, product) {
      if (err) return res.serverError (err);

      return res.redirect('/admin/product');
    });

  },

  productNewValidation: function (req, res){


    console.info('req');

    console.info(req.body);

    if (req && req.body && req.body.name) {


      var data = {};

      data = req.body;

      Product.create(data, function (err, product) {
        if (err) {
          return res.serverError(err);
        }
        else {



          var result = {};

          result.templateToInclude = 'productCreationOk';

          return res.view('admin/menu.ejs', result);


          //return res.ok('create of the product done', req.body);
        }

        //return res.redirect('/admin/product');
      });

    }
    else {


      var result = {};

      result.templateToInclude = 'productCreationKo';

      return res.view('admin/menu.ejs', result);


      //return res.ok('missing one parameter');

    }



  },

  menu: function (req, res){


    var result = {}; 
    
    result.templateToInclude = 'admin'; 

    return res.view('admin/menu.ejs', result);

  },






};