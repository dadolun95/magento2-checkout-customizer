/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
 */

var config = {
    shim: {
        'Magento_Checkout/js/view/shipping': [
            'Dadolun_Checkout/js/shipping-customizer'
        ],
        'Magento_Checkout/js/view/billing-address': [
            'Dadolun_Checkout/js/billing-customizer'
        ],
    },
    config: {
        mixins: {
            'Magento_Checkout/js/model/step-navigator': {
                'Dadolun_Checkout/js/model/step-navigator': true
            },
            'Magento_Checkout/js/view/payment/default': {
                'Dadolun_Checkout/js/view/payment/default': true
            },
            'Magento_Checkout/js/view/shipping': {
                'Dadolun_Checkout/js/view/onestep-payment-information': true
            },

            //Hook mixins

            'Magento_Checkout/js/action/create-billing-address': {
                'Dadolun_Checkout/js/hook/create-billing-address-action-mixin': true
            },
            'Magento_Checkout/js/action/create-shipping-address': {
                'Dadolun_Checkout/js/hook/create-shipping-address-action-mixin': true
            },
            'Magento_Checkout/js/action/get-payment-information': {
                'Dadolun_Checkout/js/hook/get-payment-information-action-mixin': true
            },
            'Magento_Checkout/js/action/get-totals': {
                'Dadolun_Checkout/js/hook/get-totals-action-mixin': true
            },
            'Magento_Checkout/js/action/place-order': {
                'Dadolun_Checkout/js/hook/place-order-action-mixin': true
            },
            'Magento_Checkout/js/action/recollect-shipping-rates': {
                'Dadolun_Checkout/js/hook/recollect-shipping-rates-action-mixin': true
            },
            'Magento_Checkout/js/action/redirect-on-success': {
                'Dadolun_Checkout/js/hook/redirect-on-success-action-mixin': true
            },
            'Magento_Checkout/js/action/select-billing-address': {
                'Dadolun_Checkout/js/hook/select-billing-address-action-mixin': true
            },
            'Magento_Checkout/js/action/select-payment-method': {
                'Dadolun_Checkout/js/hook/select-payment-method-action-mixin': true
            },
            'Magento_Checkout/js/action/select-shipping-address': {
                'Dadolun_Checkout/js/hook/select-shipping-address-action-mixin': true
            },
            'Magento_Checkout/js/action/select-shipping-method': {
                'Dadolun_Checkout/js/hook/select-shipping-method-action-mixin': true
            },
            'Magento_Checkout/js/action/set-billing-address': {
                'Dadolun_Checkout/js/hook/set-billing-address-action-mixin': true
            },
            'Magento_Checkout/js/action/set-payment-information': {
                'Dadolun_Checkout/js/hook/set-payment-information-action-mixin': true
            },
            'Magento_Checkout/js/action/set-shipping-information': {
                'Dadolun_Checkout/js/hook/set-shipping-information-action-mixin': true
            },
            'Magento_Checkout/js/action/update-shopping-cart': {
                'Dadolun_Checkout/js/hook/update-shopping-cart-action-mixin': true
            }
        }
    }
};
