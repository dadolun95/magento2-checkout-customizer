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

    /**
     * @param value
     * @param watch
     */
    function isMatching(value, watch) {
        if (_.isArray(watch)) {
            let match = false;
            _.forEach(watch, function(watchValue, key) {
                if (isMatching(value, watchValue)) {
                    match = true;
                }
            });
            return match;
        }
        if (_.isRegExp(watch)) {
            let regex = new RegExp(watch);
            return regex.test(watch)
        }
        if (_.isString(watch)) {
            return String(value) === watch;
        }
        if (_.isNumber(watch)) {
            return value === watch;
        }
        if (_.isBoolean(watch)) {
            return value === watch;
        }
        return false;
    }

    /**
     *
     * @param component
     * @param instructions
     */
    function watch(component, instructions) {
        if (!_.isUndefined(instructions.value)) {
            if (isMatching(component.value(), instructions.value)) {
                if (!_.isUndefined(instructions.match)) {
                    instructions.match(component);
                }
            } else {
                if (!_.isUndefined(instructions.unmatch)) {
                    instructions.unmatch(component);
                }
            }
        }
        if (!_.isUndefined(instructions.always)) {
            instructions.always(component);
        }
    }

    return async function (section, inputName, instructions) {
        let parentPath = await pathManager(section, inputName);
        switch (section) {
            case 'billing-address-form':
                if (!_.isNull(parentPath)) {
                    let inputData = inputName.split('|');
                    if (!_.isUndefined(inputData[1])) {
                        inputName = '.' + inputData[1];
                    }
                    registry.get(parentPath + inputName, function (component) {
                        component.value.subscribe(function (value) {
                            watch(component, instructions);
                        }, this);
                    });
                }
                break;
            case 'shipping-address-form':
                if (!_.isNull(parentPath)) {
                    registry.get(parentPath + inputName, function (component) {
                        component.value.subscribe(function (value) {
                            watch(component, instructions);
                        }, this);
                    });
                }
                break;
        }
        return null;
    };
});
