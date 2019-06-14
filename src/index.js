'use strict';
/**
 * This module provides access to the WordAI REST API
 * https://wordai.com/
 *
 * The API provides the ability to pass text in
 * and receive AI reworded and rewritten (spun) text in response.
 *
 * The author of this code has no formal relationship with WordAI.com and does not
 * claim to have created any of the facilities provided by WordAI.com.
 */

const fetch     = require('cross-fetch');
const wordAiUrl = 'https://wordai.com/users/turing-api.php';
const FormData  = require('form-data');

let apiOptions;

class WordAI {
  constructor (options) {
    if (!options) throw new Error('No options specified');
    if (!options.quality) throw new Error('No uniqueness quality specified');
    if (!options.email) throw new Error('No email specified');
    if (!options.hash && !options.password) throw new Error('Neither a hash nor a password was specified');
    apiOptions = options;
  }

  static spin (...args) {

    const { options, cb } = splitArgsIntoOptionsAndCallback(args);
    return getDataFromApi(wordAiUrl, options, cb);
  }
}

/**
 * Takes a variable-length array that represents arguments to a function and attempts to split it into
 * an 'options' object and a 'cb' callback function.
 * @param {Array}   args The arguments to the function
 * @return {Object}
 */
function splitArgsIntoOptionsAndCallback (args) {
  let options;
  let cb;
  if (args.length > 1) {
    options = args[0];
    cb = args[1];
  } else if ('object' === typeof args[0]) {
    options = args[0];
  } else if ('function' === typeof args[0]) {
    cb = args[0];
  }
  return { options, cb };
}

/**
 * Takes a URL string and returns a Promise containing
 * a buffer with the data from the web.
 * @param  {String} url      A URL String
 * @param  {Object} options  An object to be used for options passed to WordAI API
 * @param {Function} cb      A function passed to this function as a parameter
 * @return {Promise<Buffer>} A Promise containing a Buffer
 */
function getDataFromApi(url, options, cb) {
  let useCallback = 'function' === typeof cb;
  if (useCallback && !options.text) return cb(null, { error: "WordAI Error: No text specified", status: "Failure" });
  if (!options.text) throw new Error("WordAI Error: No text specified");
  return new Promise((resolve, reject) => {
    let formData = { ...apiOptions, ...options, s: options.text };
    const getFormData = object => Object.keys(object).reduce((fd, key) => {
      fd.append(key, object[key]);
      return fd;
    }, new FormData());
    try {
      fetch(url, {
        method: 'POST',
        body: getFormData(formData),
      })
      .then(async data => {
        try {
          if (data.status === 'Failure') return reject(data.message)
          if (useCallback) return cb(null, await data.json());
          return resolve(await data.json());
        } catch (err) {
          console.log('WordAI Error: ', err)
          if (useCallback) return cb(err);
          return reject(err);
        }
      })
      .catch(e => {
        console.error("WordAI Error: Failed to fetch API data", e)
        throw new Error("WordAI Error: Failed to fetch API data")
      })
    } catch(err) {
      console.log('WordAI Error: ', err)
      if (useCallback) return cb(err);
      return reject(err);
    }
  });
}

module.exports = WordAI;
