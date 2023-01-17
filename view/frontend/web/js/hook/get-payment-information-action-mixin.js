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

    return function (getPaymentInformationAction) {
        return wrapper.wrap(getPaymentInformationAction, function (originalAction, deferred, messageContainer) {
            let params = {
                'deferred': deferred,
                'messageContainer': messageContainer
            };
            params = executor.before('hook-before-get-payment-information', params);
            let result = originalAction(params['deferred'], params['messageContainer']);
            return executor.after('hook-after-get-payment-information', result, params);
        });
    };
});
