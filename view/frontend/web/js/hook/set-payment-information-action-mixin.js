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

    return function (setPaymentInformationAction) {
        return wrapper.wrap(setPaymentInformationAction, function (originalAction, messageContainer, paymentData) {
            let params = {
                'messageContainer': messageContainer,
                'paymentData': paymentData
            };
            params = executor.before('hook-before-set-payment-information', params);
            let result = originalAction(params['messageContainer'], params['paymentData']);
            return executor.after('hook-after-set-payment-information', result, params);
        });
    };
});
