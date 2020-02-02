## Callback Tracker

Sometimes you need to perform multiple operations before resolving an
initial callback. This tool is a small and simple way to track all the
callbacks.

example:
```
var tracker = require('callback_tracker');

function getOneThing(thingWanted, done) {
  //...

  // done(result);
}

function getAlotOfThings(thingsWanted, done) {
  var results = [];
  var track = tracker.create('done', function() {
    done(results);
  };

  thingsWanted.foreach(function(thingWanted) {
    getOneThing(thingWanted, track('getting ' + thingWanted, function(result) {
      results.push(result);
    }));
  });
}
```
