## SERVER SIDE
This module adds a custom layoutProcessors with frontend di.xml file.
This Layout Processor is responsible for every layout modification inside jsLayout.
Thanks to Piotr Rusin (https://github.com/piotr-rusin) for his amazing work with pragmatic-modules's jsLayout parser module used also here:
https://github.com/pragmatic-modules/magento2-module-jslayout-parser

## CLIENT SIDE
There are two files implicated directly on checkout modifications:
- web/js/shipping-customizer.js
- web/js/billing-customizer.js
This two files should be overrided on theme adding functionalities.
This files requires two utilities js objects that help to manipulate checkout form inputs uiComponents.

### Dadolun_Checkout/js/utils/field-watcher
```
define([
    'Dadolun_Checkout/js/utils/field-watcher',
], function (watcher) {
    watcher(
        'shipping-address-form',
        'company',
        {
            value: 'MyCompany',
            match: function(component) {
                console.log('Shipping company has "MyCompany" value.');
            },
            unmatch: function(component) {
                console.log('Shipping company is different from "MyCompany" value.');
            },
            always: function(component) {
                console.log('Executed on every change');
            }
        }
    );
}
```
You can see above that field-watcher get uiComponents from checkout.
This utility use the uiRegistry for that scope and adds match/unmatch/always callbacks on component input value change.
So, you can just specify if you need to watch "shipping-address-form" or "billing-address-form" children.
Callbacks are attached on the specified input when it's visible and ready (just like afterRender ko binding: https://knockoutjs.com/documentation/template-binding.html).
Now you can manipulate the uiComponent modifing his properties or calling his methods directly.
```
...
    {
        value: 'somevalue',
        match: function(component) {
            component.placeholder = 'myNewPlaceholder';
            component.label = 'myNewLabel';
            component.validation = {
                required: true
            };
            ...
        }
        ...
    }
...
```
The watcher object needs 3 parameters:
- form specification 'shipping-address-form' or 'billing-address-form'
- field specification 'firstname', 'lastname', ...
- an instructions object, where the 'value' property is the matching value that can be a string, an array, regex, ... (see field-watcher.js file)
If billing address is specified on watcher and Magento is configured to use billing address inside payment method you also need to specify the payment method before the field:
```
...
watcher(
        'billing-address-form',
        'checkmo|firstname',
        {
            ...
        }
);
...
```
The "checkmo" value is the payment method code. You can find also on the frontend searching the value for the radio input named "payment[method]".

### Dadolun_Checkout/js/utils/field-getter
Sometimes you'll need to manipulate a different input based on watched input.
So you can use the getter utility inside one of your callback (or also outside if you need to simply access the input's uiComponent).
```
define([
    'Dadolun_Checkout/js/utils/field-watcher',
    'Dadolun_Checkout/js/utils/field-getter',
], function (watcher, getter) {

    getter('shipping-address-form', 'company').then(
        (company) => {
            company.validation = {
                required: true
            }
        });

    watcher(
        'shipping-address-form',
        'company',
        {
            value: 'MyCompany',
            match: function(component) {
                getter('shipping-address-form', 'telephone').then(
                    (telephone) => {
                        telephone.validation = {
                            required: false
                        }
                    });
            }
        }
    );
}
```

### Dadolun_Checkout/js/utils/quote-watcher
```
define([
    'Dadolun_Checkout/js/utils/quote-watcher',
], function (quoteWatcher) {
    quoteWatcher(
        'billing-address',
        function(quote, data) {
            console.log(data);
        },
        true
    );
    quoteWatcher(
        'billing-address',
        function(data) {
            console.log(data);
        },
        false
    );
}
```
As you can see above, quote-watcher observe every quote element change.
This feature is amazing when you need to make updates on checkout sections based on address, totals, payment or shipping method changes.
You can call quote-watcher passing the element you want observe:
- billing-address
- shipping-address
- shipping-method
- payment-method
- totals
Then write the callback after the tracked change.
The third parameter specifies if you want to receive the entire updated quote also as parameter of your callback function.

### Dadolun_Checkout/js/utils/hook-register
```
define([
    'Dadolun_Checkout/js/utils/hook-register',
], function (hook) {
    hook('place-order', 'before', function (params) {
        // DO SOMETHING AMAZING!
    });
    hook('select-billing-address', 'after', function (params) {
        // DO SOMETHING AMAZING!
    });
}
```
As you can see above, hook-register let you describing new behaviors "before" and "after" every checkout action.
In particular this util is a magento2's requireJs mixins wrapper which simplifies the way you write code working before and after the checkout action uiComponents.
You can call hook-register passing the action you want to mix:
- create-billing-address
- create-shipping-address
- get-payment-action
- get-totals
- place-order-action
- recollect-shipping-rates
- redirect-on-success
- select-billing-address
- select-payment-method
- select-shipping-address
- select-shipping-method
- set-billing-address
- set-payment-information
- set-shipping-information
- update-shopping-cart

Then as second parameter specify if you want to run "before" or "after" the action execution.
Remember that "before" method can change input parameters and "after" method can change output result of the action (if have some).
As third parameter specify the callback fired on every action execution.
