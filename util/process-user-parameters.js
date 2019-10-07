/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var camelcase = require('camelcase');

/**
 * To adhere to our JS style guideline, we expose lowerCamelCase parameters to the user. However, the
 * service expects different case conventions so we have to serialize the user-provided params. We do this
 * by passing in the user params with the allowed params, looking for the camelcase version of each allowed
 * param, and creating an object with the correct keys.
 *
 * @param {object} options - the user-provided options, with lower camel case parameters
 * @param {string[]} allowedParams - array of the parameter names that the service allows
 * @returns {object}
 */
module.exports = function processUserParameters(options, allowedParams) {
  var processedOptions = {};

  // look for the camelcase version of each parameter - that is what we expose to the user
  allowedParams.forEach(param => {
    var keyName = camelcase(param);
    if (options[keyName] !== undefined) {
      processedOptions[param] = options[keyName];
    }
  });

  return processedOptions;
};
