# Magento2 Checkout Customizer Module <img src="https://avatars.githubusercontent.com/u/168457?s=40&v=4" alt="magento" />

### Dadolun_Checkout

## Features
- Customization of the checkout page, choosing between the two step layout (Magento default) and the one step layout. In the case of the one step, you can choose between 1 column, 2 columns or 3 columns.
- Customization of billing address position. You can choose to place it inside or outside the payment methods (Magento default), in case of outside position you can additionaly move it in a separated section like shipping address.
- Add Js utilities for shipping and billing address inputs manipulation.

## Installation
You can install this module adding it on app/code folder or with composer.

##### COMPOSER
```
composer require dadolun95/magento2-checkout-customizer
```
##### MAGENTO
Then you'll need to enable the module and update your database:
```
php bin/magento module:enable Dadolun_Checkout Pragmatic_JsLayoutParser
php bin/magento setup:upgrade
php bin/magento setup:di:compile
```

##### CONFIGURATION
You must enable the module from "Stores > Configurations > Dadolun > Checkout" section.

## Contributing
Contributions are very welcome. In order to contribute, please fork this repository and submit a [pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).
