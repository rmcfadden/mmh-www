#!/usr/bin/env node

'use strict';

var models  = require('../models');
var Promise = require('promise');
var randomstring = require("randomstring");

var async = require('async');
addTestVenues();

  console.log('Node Environment =' + process.env.NODE_ENV)


function addTestVenues(num){
  if(!num){
    num = 25;
  }

  console.log('Adding ' + num + ' test destinations')

  getCounties().then(function(countries){
    var destinationCount = 0;
    for(var i=0;i < num; i++){
      async.waterfall([
        function createOrganization(next){
          var organizationName = "organization - " + randomstring.generate();
          models.organization.create({ name: organizationName}).then(function(organization){
            next(null, countries[Math.floor(Math.random() * countries.length)].id, organization.id);
          });
        },
        function createAddress(country_id, organization_id, next){
          models.address.create({
            address_line1: 'testing address1',
            address_line2: 'testing address2',
            city: 'Santa Barbara',
            province: 'California',
            postal_code: '93105',
            country_id: country_id
          }).then(function(address) {
            next(null, country_id, organization_id, address.id)
          });        
        },
        function createDestination(country_id, organization_id, address_id, next){
          var destinationName = "destination " + randomstring.generate();
          models.destination.create(
          {
              name: destinationName,
              organization_id: organization_id,
              address_id: address_id,
              description: 'bla, bla'
          }).then(function(destination){
            
            next()
          });
        }
        
      ],function(error, result){
        if(++destinationCount == num){
          process.exit();
        }
      });
    }
  });
}





function getCounties(){
  return new Promise(function(resolve, reject){
    models.country.findAll({}).then(function(countries){
      resolve(countries);
    }).catch(function(error){
      reject(Error);
    });
  });
}


function createTestAddress(country_id){
  return new Promise(function(resolve, reject){
    models.address.create(
      {
        address_line1: 'testing address1',
        address_line2: 'testing address2',
        city: 'Santa Barbara',
        province: 'California',
        postal_code: '93105',
        country_id: country_id
      }).then(function(address){
      resolve(address);
    }).catch(function(error){
      reject(Error);
    });
  });
}


function createTestVenue(address_id, organization_id){
  return new Promise(function(resolve, reject){
    
    var destinationName = "destination " + randomstring.generate();
    models.destination.create(
      {
        name: destinationName,
        organization_id: organization_id,
        address_id: address_id,
        description: 'bla, bla'
      }).then(function(destination){
      resolve(destination);
    }).catch(function(error){
      reject(Error);
    });
  });
}


function createTestOrganization(){
  return new Promise(function(resolve, reject){
    var organizationName = "organization" + randomstring.generate();
    models.organization.create({
        name: organizationName
      }).then(function(organization){
      resolve(organization);
    }).catch(function(error){
      reject(Error);
    });
  });
}