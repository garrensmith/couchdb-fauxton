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
  'api',
  'addons/cors/actiontypes',
  'addons/cors/resources'
  ], function (FauxtonAPI, ActionTypes, Resources) {
    return {
      editCors: function (options) {
        FauxtonAPI.dispatch({
          type: ActionTypes.EDIT_CORS,
          options: options
        });
      },

      toggleEnableCors: function () {
        FauxtonAPI.dispatch({
          type: ActionTypes.TOGGLE_ENABLE_CORS
        });
      },

      addOrigin: function (origin) {
        FauxtonAPI.dispatch({
          type: ActionTypes.CORS_ADD_ORIGIN,
          origin: origin
        });
      },

      originChange: function (isAllOrigins) {
        FauxtonAPI.dispatch({
          type: ActionTypes.CORS_IS_ALL_ORIGINS,
          isAllOrigins: isAllOrigins
        });
      },

      deleteOrigin: function (origin) {
        FauxtonAPI.dispatch({
          type: ActionTypes.CORS_DELETE_ORIGIN,
          origin: origin
        });
      },

      updateOrigin: function (updatedOrigin, originalOrigin) {
        FauxtonAPI.dispatch({
          type: ActionTypes.CORS_UPDATE_ORIGIN,
          updatedOrigin: updatedOrigin,
          originalOrigin: originalOrigin
        });
      },
      methodChange: function (httpMethod) {
        FauxtonAPI.dispatch({
          type: ActionTypes.CORS_METHOD_CHANGE,
          httpMethod: httpMethod
        });
      },

      saveEnableCorsToHttpd: function (enableCors) {
        var enableOption = new Resources.ConfigModel({
          section: 'httpd',
          attribute: 'enable_cors',
          value: enableCors.toString()
        });

        return enableOption.save();
      },

      saveCorsOrigins: function (origins) {
        var allowOrigins = new Resources.ConfigModel({
          section: 'cors',
          attribute: 'origins',
          value: origins.join(',')
        });

        return allowOrigins.save();
      },

      saveCorsCredentials: function () {
        var allowCredentials = new Resources.ConfigModel({
          section: 'cors',
          attribute: 'credentials',
          value: "true"
        });

        return allowCredentials.save();
      },

      saveCorsHeaders: function () {
        var corsHeaders = new Resources.ConfigModel({
          section: 'cors',
          attribute: 'headers',
          value: 'accept, authorization, content-type, origin, referer'
        });

        return corsHeaders.save();
      },

      saveCorsMethods: function () {
        var corsMethods = new Resources.ConfigModel({
          section: 'cors',
          attribute: 'methods',
          value: 'GET, PUT, POST, HEAD, DELETE'
        });

        return corsMethods.save();
      },

      saveCors: function (options) {
        var promises = [];
        promises.push(this.saveEnableCorsToHttpd(options.enableCors));

        if(options.enableCors) {
          promises.push(this.saveCorsOrigins(options.origins));
          promises.push(this.saveCorsCredentials());
          promises.push(this.saveCorsHeaders());
          promises.push(this.saveCorsMethods());
        }

        FauxtonAPI.dispatch({
          type: ActionTypes.CORS_SAVING
        });

        FauxtonAPI.when(promises).then(function () {
          FauxtonAPI.addNotification({
            msg: 'Cors settings updated',
            type: 'success',
            clear: true
          });

          FauxtonAPI.dispatch({
            type: ActionTypes.CORS_SAVED
          });
        }, function () {
          FauxtonAPI.addNotification({
            msg: 'Error! Could not save your CORS settings. Please try again.',
            type: 'error',
            clear: true
          });

          FauxtonAPI.dispatch({
            type: ActionTypes.CORS_SAVED
          });

        });
      }
    };
  });
