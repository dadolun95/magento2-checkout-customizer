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

    return function (selectBillingAddressAction) {
        return wrapper.wrap(selectBillingAddressAction, function (originalAction, billingAddress) {
            let params = {
                'billingAddress': billingAddress
            };
            params = executor.before('hook-before-select-billing-address', params);
            let result = originalAction(params['billingAddress']);
            return executor.after('hook-after-select-billing-address', result, params);
        });
    };
});
