/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://github.com/dadolun95)
 */

define([
    'jquery',
    'Dadolun_Checkout/js/hook/hook-executor'
], function ($, executor) {
    'use strict';

    let updateShoppingCartAction = {
        onSubmit: function (event) {
            let params = {
                'event': event
            };
            params = executor.before('hook-before-update-shopping-cart', params);
            let result = this._super(params);
            return executor.after('hook-after-update-shopping-cart', result, params);
        }
    };

    return function (targetWidget) {
        $.widget('mage.updateShoppingCart', targetWidget, updateShoppingCartAction);
        return $.mage.updateShoppingCart;
    };
});
