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

    return function (action, type, hookFunction) {
        let hookRegistryNode = 'hook-' + type + '-' + action;
        let hooks = registry.get(hookRegistryNode)??[];
        hooks.push(hookFunction);
        registry.set(hookRegistryNode, hooks);
    };
});
