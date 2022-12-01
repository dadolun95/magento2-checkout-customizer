/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
 */

var config = {
    map: {
        '*': {
            'Magento_Checkout/template/shipping.html':
                'Dadolun_Checkout/template/shipping.html',
        }
    },
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
            }
        }
    }
};
