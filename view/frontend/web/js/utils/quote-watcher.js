/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
 */

define([
    'uiRegistry',
    'Magento_Checkout/js/model/quote'
], function (registry, quote) {
    'use strict';

    return function (quoteObject, callback, getQuote = false) {
        switch (quoteObject) {
            case 'billing-address':
                quote.billingAddress.subscribe(function(address) {
                    if (getQuote) {
                        return callback(quote, address);
                    }
                    return callback(address);
                });
                break;
            case 'shipping-address':
                quote.shippingAddress.subscribe(function(address) {
                    if (getQuote) {
                        return callback(quote, address);
                    }
                    return callback(address);
                });
                break;
            case 'shipping-method':
                quote.shippingMethod.subscribe(function(method) {
                    if (getQuote) {
                        return callback(quote, method);
                    }
                    return callback(method);
                });
                break;
            case 'payment-method':
                quote.paymentMethod.subscribe(function(method) {
                    if (getQuote) {
                        return callback(quote, method);
                    }
                    return callback(method);
                });
                break;
            case 'totals':
                quote.totals.subscribe(function(totals) {
                    if (getQuote) {
                        return callback(quote, totals);
                    }
                    return callback(totals);
                });
                break;
        }
        return null;
    };
});
