
var should = require('should');
var shell  = require('shelljs');
var vizion = require('..');
var p      = require('path');

describe('Git scenario', function() {
  var repo_pwd = '';
  var tmp_meta = {};

  before(function(done) {
    this.timeout(10000);
    shell.cd('test/fixtures');


    if (shell.ls('angular-bridge').length == 0)
      shell.exec('git clone https://github.com/Unitech/angular-bridge.git');

    repo_pwd = p.join(shell.pwd(), 'angular-bridge');

    done();
  });

  after(function(done) {
    //shell.rm('-rf', 'angular-bridge');
    done();
  });

  it('should update to latest', function(done) {
    vizion.update({
      folder : repo_pwd
    }, function(err, met) {
      should(err).not.exist;
      done();
    });
  });

  it('should analyze versioned folder', function(done) {
    vizion.analyze({
      folder: repo_pwd
    }, function(err, meta) {
      should(err).not.exist;

      should(meta.next_rev).be.null;
      should(meta.prev_rev).not.be.null;

      tmp_meta = meta;

      done();
    });
  });

  it('should checkout older version', function(done) {
    vizion.revertTo({
      folder     : repo_pwd,
      revision   : tmp_meta.prev_rev
    }, function(err, meta) {
      should(err).not.exist;

      done();
    });
  });

  it('should has next and prev', function(done) {
    vizion.analyze({
      folder: repo_pwd
    }, function(err, meta) {
      should(err).not.exist;

      should(meta.next_rev).not.be.null;
      should(meta.prev_rev).not.be.null;

      tmp_meta = meta;

      done();
    });
  });

  // Skip test - nothing shown
  it.skip('should see that its not on head', function(done) {
    this.timeout(10000);

    vizion.isUpToDate({
      folder : repo_pwd
    }, function(err, meta) {
      if (err) throw new Error(err);

      should(err).not.exist;
      meta.is_up_to_date.should.be.false;
    });
  });


});