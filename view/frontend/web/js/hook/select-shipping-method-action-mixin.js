/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://github.com/dadolun95)
 */

define([
    'jquery',
    'mage/utils/wrapper',
    'Dadolun_Checkout/js/hook/hook-executor'
], function ($, wrapper, executor) {
    'use strict';

    return function (selectShippingMethodAction) {
        return wrapper.wrap(selectShippingMethodAction, function (originalAction, shippingMethod) {
            let params = {
                'shippingMethod': shippingMethod
            };
            params = executor.before('hook-before-select-shipping-method', params);
            let result = originalAction(params['shippingMethod']);
            return executor.after('hook-after-select-shipping-method', result, params);
        });
    };
});
