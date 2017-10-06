'use strict';

function load () {
  console.log('App is now loading.');
  return new Promise(function(resolve, reject){
    try{
        angular.bootstrap(document.body, ['dataApiControl']);
        resolve();
    }catch (err){
        reject(err);
    }
  });
}

function play () {
  console.log('App is now playing.');
}


function unload () {
  // clean up any mess we made
}
