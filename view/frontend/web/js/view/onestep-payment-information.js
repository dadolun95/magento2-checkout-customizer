/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
 */

define([
    'jquery',
    'underscore',
    'uiRegistry',
    'Magento_Ui/js/lib/validation/validator',
    'Magento_Checkout/js/model/full-screen-loader',
    'Magento_Checkout/js/action/get-payment-information'
], function ($, _, registry, validator, fullScreenLoader, getPaymentInformationAction) {
    'use strict';

    var mixin = {

        initialize: function () {
            this._super();
            let self = this;
            registry.get('checkout.steps', function(steps) {
                if (!_.isUndefined(steps.hasSteps) && steps.hasSteps === false) {
                    self.triggerPaymentInformationUpdate();
                    registry.async('checkoutProvider')(function (checkoutProvider) {
                        checkoutProvider.on('shippingAddress', function () {
                            if (self.onestepShippingValidation()) {
                                self.triggerPaymentInformationUpdate();
                            }
                        });
                    });
                }
            });
        },

        triggerPaymentInformationUpdate: function() {
            let deferred = $.Deferred();
            fullScreenLoader.startLoader();
            getPaymentInformationAction(deferred);
            $.when(deferred).done(function () {
                fullScreenLoader.stopLoader();
            });
        },

        onestepShippingValidation: function () {
            let self = this;
            let result = true;
            _.each(registry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset').elems(), function(field) {
                if (!self.fieldValidation(field)) {
                    result = false;
                }
            });
            return result;
        },

        fieldValidation: function (field) {
            let self = this;
            if (!_.isUndefined(field.value)) {
                if (!field.visible()) {
                    return true;
                }
                if (!validator(field.validation, field.value(), field.validationParams).passed) {
                    return false;
                }
            } else {
                if (field.elems().length) {
                    _.each(field.elems(), function(childField) {
                        if (self.fieldValidation(childField) === false) {
                            return false;
                        }
                    });
                }
            }
            return true;
        }
    };

    return function (shippingView) {
        return shippingView.extend(mixin);
    };
});
