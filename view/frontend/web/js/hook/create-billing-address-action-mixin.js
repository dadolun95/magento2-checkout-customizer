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

    return function (createBillingAddressAction) {
        return wrapper.wrap(createBillingAddressAction, function (originalAction, addressData) {
            let params = {
                'addressData': addressData
            };
            params = executor.before('hook-before-create-billing-address', params);
            let result = originalAction(params['addressData']);
            return executor.after('hook-after-create-billing-address', result, params);
        });
    };
});
