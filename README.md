# Magento2 Checkout Customizer Module <img src="https://avatars.githubusercontent.com/u/168457?s=40&v=4" alt="magento" />

### Dadolun_Checkout

## Features
- Customize Magento checkout page choosing from onestep vs twostep (Magento default)
- Customize billing address position. You can choose to place it under shipping address and also under and inside payment methods (Magento default)
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
