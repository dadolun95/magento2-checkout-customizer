/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://github.com/dadolun95)
 */

define([
    'mage/utils/wrapper',
    'Dadolun_Checkout/js/hook/hook-executor'
], function (wrapper, executor) {
    'use strict';

    return function (redirectOnSuccessAction) {
        redirectOnSuccessAction.execute = wrapper.wrapSuper(redirectOnSuccessAction.execute, function () {
            let params = {};
            executor.before('hook-before-redirect-on-success', params);
            let result = this._super();
            return executor.after('hook-after-redirect-on-success', result, params);

        });
        return redirectOnSuccessAction;
    };
});
