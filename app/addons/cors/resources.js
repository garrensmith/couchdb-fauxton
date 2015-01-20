// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

define([
  "app",
  "api"
],

function (app, FauxtonAPI) {
  var CORS = FauxtonAPI.addon();


  CORS.Config = FauxtonAPI.Model.extend({
    url: function() {
      return app.host+"/_config/cors";
    }
  });

  CORS.Httpd = FauxtonAPI.Model.extend({
    url: function() {
      return app.host+"/_config/httpd";
    },

    corsEnabled: function () {
      var enabledCors = this.get('enable_cors');

      if (_.isUndefined(enabledCors)) {
        return false;
      }

      return enabledCors === "true";
    }

  });

  CORS.ConfigModel = Backbone.Model.extend({
    documentation: "cors",

    url: function () {
      return app.host + '/_config/' + encodeURIComponent(this.get("section")) + '/' + encodeURIComponent(this.get("attribute"));
    },

    isNew: function () { return false; },

    sync: function (method, model, options) {

      var params = {
        url: model.url(),
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(model.get('value'))
      };

      if (method === 'delete') {
        params.type = 'DELETE';
      } else {
        params.type = 'PUT';
      }

      return $.ajax(params);
    }

  });

    // simple helper function to validate the user entered a valid domain starting with http(s) and
  // not including any subfolder
  CORS.validateCORSDomain = function (str) {
    return (/^https?:\/\/[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/).test(str);
  };

  return CORS;
});
