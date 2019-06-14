'use strict';

const should = require('should'),
  WordAI = require('../src');

if (!process.env.WORDAI_EMAIL) throw new Error('No WordAI Email specified. Please create an environment variable named WORDAI_EMAIL');
if (!process.env.WORDAI_KEY) throw new Error('No WordAI Hash specified. Please create an environment variable named WORDAI_KEY');
new WordAI({
  email: process.env.WORDAI_EMAIL,
  hash: process.env.WORDAI_KEY,
  output: 'json',
  quality: 'Unique',
});

describe('WordAI', function () {
  describe('Spin', function () {
    it('should return "Success" and a string of spun text', function (done) {
      this.timeout(120000);
      WordAI.spin({
        text: 'Here is an example.',
        returnspin: 'true',
        sentence: 'on',
      })
      .then(res => {
        res.status.should.equal('Success');
        should.exist(res.text);
        return done();
      }).catch(done);
    });

    it('should return "Success" and a string of spun text using a callback', function (done) {
      this.timeout(120000);
      WordAI.spin({
        text: 'Here is another example sentence with more words and some hard hitting colorful adjectives that are sure to make you day brighter.',
        returnspin: 'true',
        sentence: 'on',
      }, (err, res) => {
        if (err) {
          return done(err);
        }
        res.status.should.equal('Success');
        should.exist(res.text);
        done();
      });
    });

    it('should return "Failure" and a string of spun text using a callback and empty params object', function (done) {
      WordAI.spin({}, (err, res) => {
        if (err) {
          return done(err);
        }
        res.status.should.equal('Failure');
        should.exist(res.error);
        done();
      });
    });
  });
});
