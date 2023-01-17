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

    return function (getTotalsAction) {
        return wrapper.wrap(getTotalsAction, function (originalAction, callbacks, deferred) {
            let params = {
                'callbacks': callbacks,
                'deferred': deferred
            };
            params = executor.before('hook-before-get-totals', params);
            let result = originalAction(params['callbacks'], params['deferred']);
            return executor.after('hook-after-get-totals', result, params);
        });
    };
});
