var Tracker = {
  create: function(name, done) {
    var tracker = function(subname, handler) {
      ++tracker.outstanding;

      var subtracker = function() {
        Tracker.logger.debug('subtracker', subname, 'is done');

        if (subtracker.handler) {
          subtracker.handler.apply(this, arguments);
        }

        tracker.complete();
      };

      subtracker.handler = handler;

      return subtracker;
    };

    tracker.outstanding = 0;
    tracker.done = done;

    tracker.complete = function() {
      Tracker.logger.debug('complete', name, tracker.outstanding);
      if (--tracker.outstanding < 1 && tracker.done) {
        tracker.done();
      }
    };

    return tracker;
  },

  logger: require('minilog')('tracker')
};

module.exports = Tracker;

