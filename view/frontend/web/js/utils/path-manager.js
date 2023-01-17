/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
 */

define([
    'underscore',
    'uiRegistry'
], function (_, registry) {
    'use strict';

    return async function (section, inputName) {
        let result = null;
        switch (section) {
            case 'billing-address-form':
                registry.get('checkout.steps', function (stepsComponent) {
                    if (stepsComponent.billingFormPath !== 'checkout.steps.billing-step.payment.payments-list') {
                        result = stepsComponent.billingFormPath;
                    } else {
                        let inputData = inputName.split('|');
                        if (!_.isUndefined(inputData[0])) {
                            result = stepsComponent.billingFormPath + '.' + inputData[0] + '-form.form-fields'
                        }
                    }
                });
                break;
            case 'shipping-address-form':
                result = 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.';
        }
        return result;
    };
});
