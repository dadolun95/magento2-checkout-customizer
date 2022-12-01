/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
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
