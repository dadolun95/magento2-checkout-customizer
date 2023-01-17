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

    return function (placeOrderAction) {
        return wrapper.wrap(placeOrderAction, function (originalAction, paymentData, messageContainer) {
            let params = {
                'paymentData': paymentData,
                'messageContainer': messageContainer
            };
            params = executor.before('hook-before-place-order', params);
            let result = originalAction(params['paymentData'], params['messageContainer']);
            return executor.after('hook-after-place-order', result, params);
        });
    };
});
