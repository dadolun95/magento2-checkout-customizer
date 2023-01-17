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

    return function (recollectShippingRatesAction) {
        return wrapper.wrap(recollectShippingRatesAction, function (originalAction) {
            let params = {};
            executor.before('hook-before-recollect-shipping-rates', params);
            let result = originalAction();
            return executor.after('hook-after-recollect-shipping-rates', result, params);
        });
    };
});
