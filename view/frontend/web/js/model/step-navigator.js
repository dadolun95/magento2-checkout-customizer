/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://github.com/dadolun95)
 */

define([
    'underscore',
    'mage/utils/wrapper',
    'uiRegistry'
], function (_, wrapper, registry) {
    'use strict';

    return function (stepNavigator) {
        stepNavigator.registerStep = wrapper.wrapSuper(stepNavigator.registerStep, function (code, alias, title, isVisible, navigate, sortOrder) {
            let self = this;
            registry.get('checkout.steps', function (steps) {
                if (_.isUndefined(steps.hasSteps) || steps.hasSteps) {
                    self._super(code, alias, title, isVisible, navigate, sortOrder);
                } else {
                    isVisible(true);
                }
            });
        });
        return stepNavigator;
    };
});
