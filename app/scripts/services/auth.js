/**
 * Satellizer
 * (c) 2014 Sahat Yalkabov
 * License: MIT
 */

(function (window, angular, undefined) {
    'use strict';

    angular.module('dongker.auth', [])
        .constant('satellizer.config', {
            loginOnSignup: true,
            loginRedirect: '/',
            logoutRedirect: '/',
            signupRedirect: '/login',
            loginUrl: '/auth/login',
            signupUrl: '/auth/signup',
            loginRoute: '/login',
            signupRoute: '/signup',
            tokenName: 'token',
            tokenPrefix: 'satellizer',
            unlinkUrl: '/auth/unlink/',
            minutesToRenewToken: 10,
            renewTokenUrl: '/auth/token/renew',
            providers: {
                google: {
                    url: '/auth/google',
                    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                    redirectUri: currentUrl(),
                    scope: ['profile', 'email'],
                    scopePrefix: 'openid',
                    scopeDelimiter: ' ',
                    requiredUrlParams: ['scope'],
                    optionalUrlParams: ['display'],
                    display: 'popup',
                    type: '2.0',
                    popupOptions: { width: 452, height: 633 }
                },
                facebook: {
                    url: '/auth/facebook',
                    authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
                    redirectUri: currentUrl() + '/',
                    scope: ['email'],
                    scopeDelimiter: ',',
                    requiredUrlParams: ['display', 'scope'],
                    display: 'popup',
                    type: '2.0',
                    popupOptions: { width: 481, height: 269 }
                },
                linkedin: {
                    url: '/auth/linkedin',
                    authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
                    redirectUri: currentUrl(),
                    requiredUrlParams: ['state'],
                    scope: ['r_emailaddress'],
                    scopeDelimiter: ' ',
                    state: 'STATE',
                    type: '2.0',
                    popupOptions: { width: 527, height: 582 }
                },
                github: {
                    name: 'github',
                    url: '/auth/github',
                    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
                    redirectUri: currentUrl(),
                    scope: [],
                    scopeDelimiter: ' ',
                    type: '2.0',
                    popupOptions: { width: 1020, height: 618 }
                },
                twitter: {
                    url: '/auth/twitter',
                    type: '1.0',
                    popupOptions: { width: 495, height: 645 }
                },
                yahoo: {
                    url: '/auth/yahoo',
                    type: '1.0',
                    popupOptions: { width: 559, height: 519 }
                }
            }
        })
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .service('satellizer.storage', [
            '$injector',
            function ($injector) {
                // Sets storage to use
                var put, get, remove = null;
                if (localStorage) {
                    put = function (what, value) {
                        return localStorage.setItem(what, value);
                    };
                    get = function (what) {
                        return localStorage.getItem(what);
                    };
                    remove = function (what) {
                        return localStorage.removeItem(what);
                    };
                } else {
                    var $cookieStore = $injector.get('$cookieStore');
                    put = function (what, value) {
                        return $cookieStore.put(what, value);
                    };
                    get = function (what) {
                        return $cookieStore.get(what);
                    };
                    remove = function (what) {
                        return $cookieStore.remove(what);
                    };
                }
                var config = $injector.get('satellizer.config');
                var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
                this.store = function (token) {
                    put(tokenName, token);

                };
                this.get = function () {

                    var token = get(tokenName);
                    return token;
                };
                this.remove = function () {
                    remove(tokenName);
                };
            }
        ])
        .provider('$auth', ['satellizer.config', function (config) {
            Object.defineProperties(this, {
                logoutRedirect: {
                    get: function () {
                        return config.logoutRedirect;
                    },
                    set: function (value) {
                        config.logoutRedirect = value;
                    }
                },
                loginRedirect: {
                    set: function (value) {
                        config.loginRedirect = value;
                    },
                    get: function () {
                        return config.loginRedirect;
                    }
                },
                signupRedirect: {
                    get: function () {
                        return config.signupRedirect;
                    },
                    set: function (value) {
                        config.signupRedirect = value;
                    }
                },
                loginOnSignup: {
                    get: function () {
                        return config.loginOnSignup;
                    },
                    set: function (value) {
                        config.loginOnSignup = value;
                    }
                },
                loginUrl: {
                    get: function () {
                        return config.loginUrl;
                    },
                    set: function (value) {
                        config.loginUrl = value;
                    }
                },
                signupUrl: {
                    get: function () {
                        return config.signupUrl;
                    },
                    set: function (value) {
                        config.signupUrl = value;
                    }
                },
                loginRoute: {
                    get: function () {
                        return config.loginRoute;
                    },
                    set: function (value) {
                        config.loginRoute = value;
                    }
                },
                signupRoute: {
                    get: function () {
                        return config.signupRoute;
                    },
                    set: function (value) {
                        config.signupRoute = value;
                    }
                },
                tokenName: {
                    get: function () {
                        return config.tokenName;
                    },
                    set: function (value) {
                        config.tokenName = value;
                    }
                },
                tokenPrefix: {
                    get: function () {
                        return config.tokenPrefix;
                    },
                    set: function (value) {
                        config.tokenPrefix = value;
                    }
                },
                unlinkUrl: {
                    get: function () {
                        return config.unlinkUrl;
                    },
                    set: function (value) {
                        config.unlinkUrl = value;
                    }
                },
                requestFilter: {
                    get: function () {
                        return config.requestFilter;
                    },
                    set: function (value) {
                        config.requestFilter = value;
                    }
                },
                minutesToRenewToken: {
                    get: function () {
                        return config.minutesToRenewToken;
                    },
                    set: function (value) {
                        config.minutesToRenewToken = value;
                    }
                },
                renewTokenUrl: {
                    get: function () {
                        return config.renewTokenUrl;
                    },
                    set: function (value) {
                        config.renewTokenUrl = value;
                    }
                },
                responseFilter: {
                    get: function () {
                        return config.responseFilter;
                    },
                    set: function (value) {
                        config.responseFilter = value;
                    }
                }
            });

            angular.forEach(Object.keys(config.providers), function (provider) {
                this[provider] = function (params) {
                    return angular.extend(config.providers[provider], params);
                };
            }, this);

            var oauth = function (params) {
                config.providers[params.name] = config.providers[params.name] || {};
                angular.extend(config.providers[params.name], params);
            };

            this.oauth1 = function (params) {
                oauth(params);
                config.providers[params.name].type = '1.0';
            };

            this.oauth2 = function (params) {
                oauth(params);
                config.providers[params.name].type = '2.0';
            };
            var events = {loginSuccess: 'loginSuccess',
                loginFailure: 'loginFailure',
                logout: 'logout',
                forbidden: 'forbidden',
                unAuthorized: 'unAuthorized'
            };

            this.eventHandlers = {};
            var self = this;
            this.on = function (anEvent, handler) {
                if (!this.eventHandlers[anEvent]) {
                    this.eventHandlers[anEvent] = [];
                }
                this.eventHandlers[anEvent].push(handler);
            };
            self['addLoginSuccessHandler'] = function (handler) {
                self.on(events.loginSuccess, handler);
            };
            self['addLoginFailureHandler'] = function (handler) {
                self.on(events.loginFailure, handler);
            };
            self['addLogoutHandler'] = function (handler) {
                self.on(events.logout, handler);
            };
            self['addForbiddenHandler'] = function (handler) {
                self.on(events.forbidden, handler);
            };
            self['addUnAuthorizedHandler'] = function (handler) {
                self.on(events.unAuthorized, handler);
            };

            this.$get = [
                '$q',
                '$injector',
                '$rootScope',
                '$location',
                'satellizer.shared',
                'satellizer.local',
                'satellizer.oauth',
                'satellizer.storage',
                'AUTH_EVENTS',
                function ($q, $injector, $rootScope, $location, shared, local, oauth, authStorage, AUTH_EVENTS) {
                    var $auth = {};
                    var getHandlers = function (anEvent) {
                        return self.eventHandlers[anEvent];
                    };
                    var callHandler = function (anEvent, locals) {
                        $rootScope.$broadcast('$auth.' + anEvent, locals);
                        angular.forEach(getHandlers(anEvent) || [], function (handler) {
                            $injector.invoke(handler, $auth, locals);
                        });
                    };

                    function forbidden(data) {
                        var deferred = $q.defer();
                        authStorage.remove();

                        if (config.loginRoute) {
                            $location.path(config.loginRoute);
                        }
                        else {
                            callHandler(events.forbidden);
                        }

                        deferred.resolve();

                        return deferred.promise;
                    }

                    function onSiginOk(token, isRefresh) {
                        authStorage.store(token);
                        var tokenPayload = $auth.getPayload();
                        var res = {
                            token: token,
                            tokenPayload: tokenPayload
                        }
                        angular.extend($auth, res);
                        callHandler(!isRefresh ? events.loginSuccess : 'authenticated', res);
                    }

                    function renewToken() {
                        var deferred = $q.defer();

                        $http.post(config.renewTokenUrl)
                            .then(function (response) {
                                shared.setToken(response, deferred, true);
                            })
                            .then(null, function (response) {
                                deferred.reject(response);
                            });

                        return deferred.promise;
                    }

                    var refreshingToken = null;
                    $rootScope.$on('$locationChangeStart', function () {
                        if (!$auth.isAuthenticated()) {
                            var token = shared.getToken();
                            if (token && token != 'null') {
                                if (shared.hasTokenExpired()) {
                                    var refreshToken;
                                    if (refreshToken) {
                                        //todo: refresh token;
                                    }
                                    else {
                                        forbidden();
                                    }
                                    return;
                                }
                                onSiginOk(token, true);
                                return;
                            }

                        }
                        else{
                            var expireDate = shared.getTokenExpirationDate(shared.getToken());
                            if (expireDate && (expireDate.valueOf() - new Date().valueOf() <= config.minutesToRenewToken * 60 * 1000)) {
                                //to renew token
                                renewToken();
                                return;
                            }
                        }
                    });
                    if (config.loginRoute) {
                        $rootScope.$on('$routeChangeStart', function (e, nextRoute) {
                            if (nextRoute.$$route && nextRoute.$$route.requiresLogin) {
                                if (!$auth.isAuthenticated() && !refreshingToken) {
                                    $location.path(config.loginRoute);
                                }
                            }
                        });
                    }
                    //http status 401
                    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (e, d) {
                        //if login then pass to login controller handle it;
                        if (d.config.url == config.loginUrl) {
                            callHandler(events.loginFailure, d.data);
                        }
                        else {
                            forbidden(d);
                        }
                    });
                    //http status 419
                    $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {

                        forbidden();
                    });
                    //http status 403
                    $rootScope.$on(AUTH_EVENTS.notAuthorized, function () {

                        callHandler(events.unAuthorized, shared.getPayload());
                    });

                    $auth.authenticate = function (name, userData) {
                        return oauth.authenticate(name, false, userData);
                    };

                    $auth.login = $auth.signon = function (user, defer) {
                        var deferred = defer || $q.defer();
                        var promise = local.login(user, deferred).then(function (success) {
                            deferred.resolve();
                        }).then(null, function (err) {
                            deferred.reject(err);
                        });


                        return deferred.promise;
                    };

                    $auth.signup = function (user) {
                        return local.signup(user);
                    };

                    $auth.logout = $auth.signout = function () {
                        return shared.logout();
                    };

                    $auth.isAuthenticated = function () {
                        return shared.isAuthenticated();
                    };

                    $auth.link = function (name, userData) {
                        return oauth.authenticate(name, true, userData);
                    };

                    $auth.unlink = function (provider) {
                        return oauth.unlink(provider);
                    };

                    $auth.getToken = function () {
                        return shared.getToken();
                    };

                    $auth.getPayload = function () {
                        return shared.getPayload();
                    };
                    $auth.hookEvents = function () {
                        // Does nothing. Hook events on application's run
                    };

                    return $auth;
                }];

        }])
        .factory('satellizer.shared', [
            '$q',
            '$window',
            '$location',
            'satellizer.config',
            'satellizer.storage',
            function ($q, $window, $location, config, authStorage) {
                var shared = {};

                shared.getToken = function () {
                    return authStorage.get();
                };


                shared.getPayload = function () {
                    var token = shared.getToken();
                    if (token && token.split('.').length === 3) {
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-', '+').replace('_', '/');
                        var payload = JSON.parse($window.atob(base64));
                        return payload;
                    }
                };
                shared.getTokenExpirationDate = function (token) {
                    var decoded;
                    try {
                        decoded = shared.getTokenPayload(token);
                    } catch (e) {
                        return null;
                    }


                    if (!decoded.exp) {
                        return null;
                    }

                    var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
                    d.setUTCSeconds(decoded.exp);

                    return d;
                };
                shared.hasTokenExpired = function (token) {
                    if (!token) {
                        return true;
                    }

                    var d = shared.getTokenExpirationDate(token);

                    if (isNaN(d)) {
                        return true;
                    }

                    // Token expired?
                    if (d.valueOf() > new Date().valueOf()) {
                        // No
                        return false;
                    } else {
                        // Yes
                        return true;
                    }
                };
                shared.setToken = function (response, deferred, isLinking) {
                    var token = response.data[config.tokenName];

                    if (!token) {
                        throw new Error('Expecting a token named "' + config.tokenName + '" but instead got: ' + JSON.stringify(response.data));
                    }

                    authStorage.store(token);
                    if (config.loginRedirect && !isLinking) {
                        $location.path(config.loginRedirect);
                    }

                    deferred.resolve(response);
                };

                shared.isAuthenticated = function () {
                    var token = authStorage.get();
                    if (token) {
                        if (token.split('.').length === 3) {
                            var base64Url = token.split('.')[1];

                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            try {
                                var exp = JSON.parse($window.atob(base64)).exp;

                            } catch (err) {
                                authStorage.remove();//remove error token string from localstorage
                                return false;
                            }
                            return Math.round(new Date().getTime() / 1000) <= exp;
                        } else {
                            return true;
                        }
                    }

                    return false;
                };

                shared.logout = function () {
                    var deferred = $q.defer();
                    authStorage.remove();
                    if (config.logoutRedirect) {
                        $location.path(config.logoutRedirect);
                    }

                    deferred.resolve();

                    return deferred.promise;
                };

                function intercept(url) {
                    if (url.indexOf($window.location.origin) === 0) {
                        return true;
                    }

                    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                        return true;
                    }

                    return false;
                }

                shared.requestFilter = config.requestFilter = (config.requestFilter || function (httpConfig) {
                    return intercept(httpConfig.url);
                });

                shared.responseFilter = config.responseFilter = (config.responseFilter || function (response) {
                    return intercept(response.config.url);
                });

                return shared;
            }])
        .factory('satellizer.oauth', [
            '$q',
            '$http',
            'satellizer.config',
            'satellizer.shared',
            'satellizer.Oauth1',
            'satellizer.Oauth2',
            function ($q, $http, config, shared, Oauth1, Oauth2) {
                var oauth = {};

                oauth.authenticate = function (name, isLinking, userData) {
                    var deferred = $q.defer();
                    var provider = config.providers[name].type === '1.0' ? new Oauth1() : new Oauth2();

                    provider.open(config.providers[name], userData || {})
                        .then(function (response) {
                            shared.setToken(response, deferred, isLinking);
                        })
                        .then(null, function (response) {
                            deferred.reject(response);
                        });

                    return deferred.promise;
                };

                oauth.unlink = function (provider) {
                    return $http.get(config.unlinkUrl + provider);
                };

                return oauth;
            }])
        .factory('satellizer.local', [
            '$q',
            '$http',
            '$location',
            'satellizer.utils',
            'satellizer.shared',
            'satellizer.config',
            function ($q, $http, $location, utils, shared, config) {
                var local = {};

                local.login = function (user, defer) {
                    var deferred = defer || $q.defer();

                    $http.post(config.loginUrl, user)
                        .then(function (response) {
                            shared.setToken(response, deferred);
                        })
                        .then(null, function (response) {
                            deferred.reject(response);
                        });

                    return deferred.promise;
                };

                local.signup = function (user) {
                    var deferred = $q.defer();

                    $http.post(config.signupUrl, user)
                        .then(function (response) {
                            if (config.loginOnSignup) {
                                shared.setToken(response, deferred);
                            } else {
                                $location.path(config.signupRedirect);
                                deferred.resolve(response);
                            }
                        })
                        .then(null, function (response) {
                            deferred.reject(response);
                        });

                    return deferred.promise;
                };

                return local;
            }])
        .factory('satellizer.Oauth2', [
            '$q',
            '$http',
            'satellizer.popup',
            'satellizer.utils',
            'satellizer.config',
            function ($q, $http, popup, utils, config) {
                return function () {

                    var defaults = {
                        url: null,
                        name: null,
                        scope: null,
                        scopeDelimiter: null,
                        clientId: null,
                        redirectUri: null,
                        popupOptions: null,
                        authorizationEndpoint: null,
                        requiredUrlParams: null,
                        optionalUrlParams: null,
                        defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
                        responseType: 'code'
                    };

                    var oauth2 = {};

                    oauth2.open = function (options, userData) {
                        angular.extend(defaults, options);
                        var deferred = $q.defer();
                        var url = oauth2.buildUrl();

                        popup.open(url, defaults.popupOptions)
                            .then(function (oauthData) {
                                if (defaults.responseType === 'token') {
                                    var response = { data: {} };
                                    response.data[config.tokenName] = oauthData.access_token;
                                    deferred.resolve(response);
                                } else {
                                    oauth2.exchangeForToken(oauthData, userData)
                                        .then(function (response) {
                                            deferred.resolve(response);
                                        })
                                        .then(null, function (response) {
                                            deferred.reject(response);
                                        });
                                }
                            })
                            .then(null, function (error) {
                                deferred.reject(error);
                            });

                        return deferred.promise;
                    };

                    oauth2.exchangeForToken = function (oauthData, userData) {
                        var data = angular.extend({}, userData, {
                            code: oauthData.code,
                            clientId: defaults.clientId,
                            redirectUri: defaults.redirectUri
                        });

                        return $http.post(defaults.url, data);
                    };

                    oauth2.buildUrl = function () {
                        var baseUrl = defaults.authorizationEndpoint;
                        var qs = oauth2.buildQueryString();
                        return [baseUrl, qs].join('?');
                    };

                    oauth2.buildQueryString = function () {
                        var keyValuePairs = [];
                        var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

                        angular.forEach(urlParams, function (params) {
                            angular.forEach(defaults[params], function (paramName) {
                                var camelizedName = utils.camelCase(paramName);
                                var paramValue = defaults[camelizedName];

                                if (paramName === 'scope' && Array.isArray(paramValue)) {
                                    paramValue = paramValue.join(defaults.scopeDelimiter);

                                    if (defaults.scopePrefix) {
                                        paramValue = [defaults.scopePrefix, paramValue].join(defaults.scopeDelimiter);
                                    }
                                }

                                keyValuePairs.push([paramName, paramValue]);
                            });
                        });

                        return keyValuePairs.map(function (pair) {
                            return pair.join('=');
                        }).join('&');
                    };

                    return oauth2;
                };
            }])
        .factory('satellizer.Oauth1', ['$q', '$http', 'satellizer.popup', function ($q, $http, popup) {
            return function () {

                var defaults = {
                    url: null,
                    name: null,
                    popupOptions: null
                };

                var oauth1 = {};

                oauth1.open = function (options, userData) {
                    angular.extend(defaults, options);

                    var deferred = $q.defer();

                    popup.open(defaults.url, defaults.popupOptions)
                        .then(function (response) {
                            oauth1.exchangeForToken(response, userData)
                                .then(function (response) {
                                    deferred.resolve(response);
                                })
                                .then(null, function (response) {
                                    deferred.reject(response);
                                });
                        })
                        .then(null, function (response) {
                            deferred.reject(response);
                        });
                    return deferred.promise;
                };

                oauth1.exchangeForToken = function (oauthData, userData) {
                    var data = angular.extend({}, userData, oauthData);
                    var qs = oauth1.buildQueryString(data);
                    return $http.get(defaults.url + '?' + qs);
                };

                oauth1.buildQueryString = function (obj) {
                    var str = [];
                    angular.forEach(obj, function (value, key) {
                        str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    });
                    return str.join('&');
                };

                return oauth1;
            };
        }])
        .factory('satellizer.popup', [
            '$q',
            '$interval',
            '$window',
            '$location',
            'satellizer.utils',
            function ($q, $interval, $window, $location, utils) {
                var popupWindow = null;
                var polling = null;

                var popup = {};

                popup.popupWindow = popupWindow;

                popup.open = function (url, options) {
                    var deferred = $q.defer();
                    var optionsString = popup.stringifyOptions(popup.prepareOptions(options || {}));

                    popupWindow = window.open(url, '_blank', optionsString);

                    if (popupWindow && popupWindow.focus) {
                        popupWindow.focus();
                    }

                    popup.pollPopup(deferred);

                    return deferred.promise;
                };

                popup.pollPopup = function (deferred) {
                    polling = $interval(function () {
                        try {
                            if (popupWindow.document.domain === document.domain && (popupWindow.location.search || popupWindow.location.hash)) {
                                var params = popupWindow.location.search.substring(1).replace(/\/$/, '');
                                var hash = popupWindow.location.hash.substring(1).replace(/\/$/, '');
                                var qs = Object.keys($location.search()).length ? $location.search() : utils.parseQueryString(params);
                                var qsHash = utils.parseQueryString(hash);
                                angular.extend(qs, qsHash);

                                if (qs.error) {
                                    deferred.reject({ error: qs.error });
                                } else {
                                    deferred.resolve(qs);
                                }

                                popupWindow.close();
                                $interval.cancel(polling);
                            }
                        } catch (error) {
                        }

                        if (popupWindow.closed) {
                            $interval.cancel(polling);
                            deferred.reject({ data: 'Authorization Failed' });
                        }
                    }, 35);
                };

                popup.prepareOptions = function (options) {
                    var width = options.width || 500;
                    var height = options.height || 500;
                    return angular.extend({
                        width: width,
                        height: height,
                        left: $window.screenX + (($window.outerWidth - width) / 2),
                        top: $window.screenY + (($window.outerHeight - height) / 2.5)
                    }, options);
                };

                popup.stringifyOptions = function (options) {
                    var parts = [];
                    angular.forEach(options, function (value, key) {
                        parts.push(key + '=' + value);
                    });
                    return parts.join(',');
                };

                return popup;
            }])
        .service('satellizer.utils', function () {
            this.camelCase = function (name) {
                return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
                    return offset ? letter.toUpperCase() : letter;
                });
            };

            this.parseQueryString = function (keyValue) {
                var obj = {}, key, value;
                angular.forEach((keyValue || '').split('&'), function (keyValue) {
                    if (keyValue) {
                        value = keyValue.split('=');
                        key = decodeURIComponent(value[0]);
                        obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
                    }
                });
                return obj;
            };
        })
        .provider('authInterceptor', ['$authProvider', function ($authProvider) {

            var authHeader = 'Authorization';
            var authPrefix = 'Bearer ';

            this.setAuthHeader = function (name) {
                authHeader = name || authHeader;
            };
            this.setAuthPrefix = function (name) {
                authPrefix = name || authPrefix;
            };
            this.$get = [
                '$rootScope',
                '$q',
                '$injector',
                'AUTH_EVENTS',
                function ($rootScope, $q, $injector, AUTH_EVENTS) {
                    var auth;
                    return {
                        request: function (httpConfig) {

                            auth = auth || $injector.get('$auth');
                            var skip = angular.isFunction($authProvider.requestFilter) && !$authProvider.requestFilter(httpConfig);
                            if (skip) {
                                return httpConfig;
                            }
                            //var auth=$injector.get('$auth');
                            var token = auth.getToken();
                            if (token) {
                                httpConfig.headers[authHeader] = authPrefix + token;
                            }
                            return httpConfig;
                        },
                        responseError: function (response) {
                            var skip = angular.isFunction($authProvider.responseFilter) && !$authProvider.responseFilter(response);
                            if (skip) {
                                return $q.reject(response);
                            }
                            // handle the case where the user is not authenticated
                            $rootScope.$broadcast({
                                401: AUTH_EVENTS.notAuthenticated,
                                403: AUTH_EVENTS.notAuthorized,
                                419: AUTH_EVENTS.sessionTimeout,
                                440: AUTH_EVENTS.sessionTimeout
                            }[response.status], response);
                            return $q.reject(response);
                        }
                    };
                }
            ];
        }])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        }]).run([
            '$auth',
            function ($auth) {
                $auth.hookEvents();
            }]);


    // Helper functions
    function currentUrl() {
        return window.location.origin || window.location.protocol + '//' + window.location.host;
    }

})(window, window.angular);

// Base64.js polyfill (https://github.com/davidchambers/Base64.js/)
(function () {
    var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    function InvalidCharacterError(message) {
        this.message = message;
    }

    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';

    // encoder
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    object.btoa || (
        object.btoa = function (input) {
            var str = String(input);
            for (
                // initialize result and counter
                var block, charCode, idx = 0, map = chars, output = '';
                // if the next str index does not exist:
                //   change the mapping table to "="
                //   check if d has no fractional digits
                str.charAt(idx | 0) || (map = '=', idx % 1);
                // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                output += map.charAt(63 & block >> 8 - idx % 1 * 8)
                ) {
                charCode = str.charCodeAt(idx += 3 / 4);
                if (charCode > 0xFF) {
                    throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                }
                block = block << 8 | charCode;
            }
            return output;
        });

    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    object.atob || (
        object.atob = function (input) {
            var str = String(input).replace(/=+$/, '');
            if (str.length % 4 == 1) {
                throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
            }
            for (
                // initialize result and counters
                var bc = 0, bs, buffer, idx = 0, output = '';
                // get next character
                buffer = str.charAt(idx++);
                // character found in table? initialize bit storage and add its ascii value;
                ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
                ) {
                // try to find character in table (0-63, not found => -1)
                buffer = chars.indexOf(buffer);
            }
            return output;
        });
}());
