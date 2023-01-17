/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
 */

define([
    'underscore',
    'uiRegistry'
],function (_, registry) {
    'use strict';

    var mixin = {

        initialize: function() {
            let self = this;
            let result = this._super();
            registry.get('checkout.steps', function (steps) {
                if (!_.isUndefined(steps.hasSteps) && steps.hasSteps === false) {
                    let shippingComponent = registry.get('checkout.steps.shipping-step.shippingAddress');
                    let ShippingAddress = registry.get('checkoutProvider').shippingAddress;
                    if (!shippingComponent.onestepShippingValidation(ShippingAddress)) {
                        self.isPlaceOrderActionAllowed(false);
                    }
                }
            });
            return result;
        },

        placeOrder: function() {
            registry.get('checkout.steps', function (steps) {
                if (!_.isUndefined(steps.hasSteps) && steps.hasSteps === false) {
                    let shippingComponent = registry.get('checkout.steps.shipping-step.shippingAddress');
                    shippingComponent.setShippingInformation();
                    shippingComponent.validateShippingInformation();
                }
            });
            return this._super();
        },

        /**
         * @returns {*}
         */
        selectPaymentMethod: function () {
            let result = false;
            let self = this;
            registry.get('checkout.steps', function (steps) {
                if (!_.isUndefined(steps.hasSteps) && steps.hasSteps === false) {
                    let shippingComponent = registry.get('checkout.steps.shipping-step.shippingAddress');
                    shippingComponent.setShippingInformation();
                    if (!shippingComponent.validateShippingInformation()) {
                        self.isPlaceOrderActionAllowed(false);
                    } else {
                        result = self._super();
                    }
                } else {
                    result = self._super();
                }
            });
            return result;
        }
    };

    return function (paymentDefaultView) {
        return paymentDefaultView.extend(mixin);
    };
});
