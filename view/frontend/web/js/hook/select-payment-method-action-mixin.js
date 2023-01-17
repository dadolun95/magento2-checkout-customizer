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

    return function (selectPaymentMethodAction) {
        return wrapper.wrap(selectPaymentMethodAction, function (originalAction, paymentMethod) {
            let params = {
                'paymentMethod': paymentMethod
            };
            params = executor.before('hook-before-select-payment-method', params);
            let result = originalAction(params['paymentMethod']);
            return executor.after('hook-after-select-payment-method', result, params);
        });
    };
});
