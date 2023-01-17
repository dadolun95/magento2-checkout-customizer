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

    return function (setBillingAddressAction) {
        return wrapper.wrap(setBillingAddressAction, function (originalAction, messageContainer) {
            let params = {
                'messageContainer': messageContainer
            };
            params = executor.before('hook-before-set-billing-address', params);
            let result = originalAction(params['messageContainer']);
            return executor.after('hook-after-set-billing-address', result, params);
        });
    };
});
