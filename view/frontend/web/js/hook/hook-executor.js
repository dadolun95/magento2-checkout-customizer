/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://github.com/dadolun95)
 */

define([
    'underscore',
    'uiRegistry'
], function (_, registry) {
    'use strict';

    return {
        before: function(node, params) {
            let beforeHooks = registry.get(node)??[];
            _.each(beforeHooks, function (hook) {
                if (!_.isEmpty(params)) {
                    params = hook(params) ?? params;
                } else {
                    params = hook() ?? {};
                }
            });
            return params;
        },
        after: function(node, result, params) {
            let afterHooks = registry.get(node)??[];
            _.each(afterHooks, function (hook) {
                if (!_.isEmpty(params)) {
                    result = hook(result, params) ?? result;
                } else {
                    result = hook(result) ?? result;
                }
            });
            return result;
        }
    }
});
