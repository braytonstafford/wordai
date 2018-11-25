# WordAI

A node interface for WordAI's API.

[![npm](https://img.shields.io/npm/v/wordai.svg)](https://www.npmjs.com/package/wordai)
[![npm](https://img.shields.io/npm/dt/wordai.svg)](https://www.npmjs.com/package/wordai)
[![Build Status](https://travis-ci.org/braytonstafford/wordai.svg?branch=master)](https://travis-ci.org/braytonstafford/wordai)

WordAI's API allows you to POST an article or block of text and receive back a plain text or JSON formatted WordAI translated (spun) version of your text. Powered by WordAI.com.

You will need a password hash from [https://wordai.com](https://wordai.com/?ref=hbdd4).

Please look at their [documentation](https://wordai.com/api.php) to see how to use the API. The convenience functions provided by this module
simply pass their options along as form data to the REST API, so the [documentation](https://wordai.com/api.php)
is totally valid. There are some usage examples below to see how these options should be passed in.

## Add to your project
```shell
$ npm install wordai --save
```

## Test
```shell
$ export WORDAI_EMAIL=<YOUR_WORDAI_EMAIL>
$ export WORDAI_KEY=<YOUR_WORDAI_PASSWORD_HASH>
$ npm test
```

## Example usage of WordAI API
The spin method support promises and node-style callbacks.
```js
const WordAI = require('wordai');
const wordai = new WordAI({
  email: process.env.WORDAI_EMAIL,
  hash: process.env.WORDAI_KEY,
  output: 'json',
  quality: 'Regular',
});

// To request some text be process by wordAI
wordai.spin({
  text: 'Here is an example.',
// Other options here:
//   noNested: 'on',
//   sentence: 'on',
//   paragraph: 'on',
//   title: 'on',
//   returnSpin: 'true',
//   noOriginal: 'on',
//   protected: 'my,protected,words',
//   synonyms: 'word1|synonym1,word two|first synonym 2|2nd syn',
//   perfectTense: 'correct',
}).then(response => {
  console.log(response);
  /*
    {
       "uniqueness": 100,
       "text": "{Here is|Here's} {an example|a good example|an illustration}.\n",
       "status": "Success"
    }
  */
});
```
