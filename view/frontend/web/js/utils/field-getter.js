/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
 */

define([
    'uiRegistry',
    'Dadolun_Checkout/js/utils/path-manager'
], function (registry, pathManager) {
    'use strict';

    return async function (section, inputName) {
        let parentPath = await pathManager(section, inputName);
        switch (section) {
            case 'billing-address-form':
                if (!_.isNull(parentPath)) {
                    return registry.promise(parentPath + inputName).done(function(component) {
                        return component;
                    });
                }
                break;
            case 'shipping-address-form':
                if (!_.isNull(parentPath)) {
                    return registry.promise(parentPath + inputName).done(function(component) {
                        return component;
                    });
                }
                break;
        }
        return null;
    };
});
