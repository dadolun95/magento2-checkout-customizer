/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
 */

define([
    'jquery',
    'underscore',
    'uiRegistry',
    'Magento_Checkout/js/model/full-screen-loader',
    'Magento_Checkout/js/action/get-payment-information'
], function ($, _, registry, fullScreenLoader, getPaymentInformationAction) {
    'use strict';

    var mixin = {
        initialize: function () {
            this._super();
            registry.get('checkout.steps', function(steps) {
                if (!_.isUndefined(steps.hasSteps) && steps.hasSteps === false) {
                    let deferred = $.Deferred();
                    fullScreenLoader.startLoader();
                    getPaymentInformationAction(deferred);
                    $.when(deferred).done(function () {
                        fullScreenLoader.stopLoader();
                    });
                }
            });
        }
    };

    return function (shippingView) {
        return shippingView.extend(mixin);
    };
});
