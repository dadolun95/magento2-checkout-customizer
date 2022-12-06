/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
 */

define([
    'jquery',
    'underscore',
    'uiRegistry',
    'Magento_Checkout/js/model/quote',
    'Magento_Ui/js/lib/validation/validator',
    'Magento_Checkout/js/model/full-screen-loader',
    'Magento_Checkout/js/action/get-payment-information'
], function ($, _, registry, quote, validator, fullScreenLoader, getPaymentInformationAction) {
    'use strict';

    var mixin = {

        initialize: function () {
            this._super();
            let self = this;
            registry.get('checkout.steps', function(steps) {
                if (!_.isUndefined(steps.hasSteps) && steps.hasSteps === false) {
                    self.triggerPaymentInformationUpdate();
                    registry.async('checkoutProvider')(function (checkoutProvider) {
                        checkoutProvider.on('shippingAddress', function (addressData) {
                            if (self.onestepShippingValidation(addressData)) {
                                self.triggerPaymentInformationUpdate();
                                self.enablePaymentMethods();
                            } else {
                                self.disablePaymentMethods();
                            }
                        });
                    });
                }
            });
        },

        disablePaymentMethods: function() {
            let paymentList = registry.get('checkout.steps.billing-step.payment.payments-list');
            if (!_.isUndefined(paymentList)) {
                _.each(paymentList.elems(), function (paymentMethod) {
                    if (!_.isUndefined(paymentMethod.isPlaceOrderActionAllowed)) {
                        paymentMethod.isPlaceOrderActionAllowed(false);
                    }
                });
            }
        },

        enablePaymentMethods: function() {
            let paymentList = registry.get('checkout.steps.billing-step.payment.payments-list');
            if (!_.isUndefined(paymentList)) {
                _.each(paymentList.elems(), function (paymentMethod) {
                    if (!_.isUndefined(paymentMethod.isPlaceOrderActionAllowed)) {
                        paymentMethod.isPlaceOrderActionAllowed(quote.billingAddress() != null);
                    }
                });
            }
        },

        triggerPaymentInformationUpdate: function() {
            let deferred = $.Deferred();
            fullScreenLoader.startLoader();
            getPaymentInformationAction(deferred);
            $.when(deferred).done(function () {
                fullScreenLoader.stopLoader();
            });
        },

        onestepShippingValidation: function (addressData) {
            let self = this;
            let result = true;
            _.each(registry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset').elems(), function(field) {
                if (!self.fieldValidation(field, addressData)) {
                    result = false;
                }
            });
            return result;
        },

        fieldValidation: function (field, addressData) {
            let self = this;
            if (!_.isUndefined(field.value)) {
                if (!field.visible()) {
                    return true;
                }
                let fieldValue = null;
                if (field.inputName.indexOf("[") !== -1) {
                    let fieldNameParts = field.inputName.split("[");
                    fieldValue = addressData[fieldNameParts[0]][fieldNameParts[1].replace("]", "")];
                } else {
                    fieldValue = addressData[field.inputName];
                }
                if (!validator(field.validation, fieldValue, field.validationParams).passed) {
                    return false;
                }
            } else {
                if (field.elems().length) {
                    _.each(field.elems(), function(childField) {
                        if (self.fieldValidation(childField, addressData) === false) {
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
