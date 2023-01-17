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

    return function (selectShippingAddressAction) {
        return wrapper.wrap(selectShippingAddressAction, function (originalAction, shippingAddress) {
            let params = {
                'shippingAddress': shippingAddress
            };
            params = executor.before('hook-before-select-shipping-address', params);
            let result = originalAction(params['shippingAddress']);
            return executor.after('hook-after-select-shipping-address', result, params);
        });
    };
});
