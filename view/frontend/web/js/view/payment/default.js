/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
 */

define([
    'underscore',
    'uiRegistry'
],function (_, registry) {
    'use strict';

    var mixin = {

        /**
         * @returns {*}
         */
        selectPaymentMethod: function () {
            registry.get('checkout.steps', function (steps) {
                if (!_.isUndefined(steps.hasSteps) && steps.hasSteps === false) {
                    let shippingComponent = registry.get('checkout.steps.shipping-step.shippingAddress');
                    shippingComponent.setShippingInformation();
                }
            });
            return this._super();
        }
    };

    return function (paymentDefaultView) {
        return paymentDefaultView.extend(mixin);
    };
});
