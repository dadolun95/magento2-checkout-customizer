<?php
/**
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
 * @license     Open Source License
 */

declare(strict_types=1);

namespace Dadolun\Checkout\Block\Checkout;

use Magento\Checkout\Block\Checkout\LayoutProcessorInterface;
use Magento\Framework\Exception\LocalizedException;
use Pragmatic\JsLayoutParser\Api\ComponentInterface;
use Pragmatic\JsLayoutParser\Model\Component;
use Pragmatic\JsLayoutParser\Model\ComponentFactory;
use Pragmatic\JsLayoutParser\Model\JsLayoutParser;
use Dadolun\Checkout\Helper\Config;
use Magento\Checkout\Helper\Data;

/**
 * Class LayoutProcessor
 * @package Dadolun\Checkout\Block\Checkout
 */
class LayoutProcessor implements LayoutProcessorInterface
{
    /**
     * @var JsLayoutParser
     */
    private $jsLayoutParser;

    /**
     * @var Config
     */
    private $helper;

    /**
     * @var ComponentFactory
     */
    private $componentFactory;

    /**
     * @var Data
     */
    private $checkoutDataHelper;

    /**
     * LayoutProcessor constructor.
     * @param JsLayoutParser $jsLayoutParser
     * @param ComponentFactory $componentFactory
     * @param Config $helper
     * @param Data $checkoutDataHelper
     */
    public function __construct(
        JsLayoutParser $jsLayoutParser,
        ComponentFactory $componentFactory,
        Config $helper,
        Data $checkoutDataHelper
    ) {
        $this->jsLayoutParser = $jsLayoutParser;
        $this->componentFactory = $componentFactory;
        $this->helper = $helper;
        $this->checkoutDataHelper = $checkoutDataHelper;
    }

    /**
     * @param array $jsLayout
     * @return array
     * @throws LocalizedException
     */
    public function process($jsLayout)
    {
        /** @var ComponentInterface $checkout */
        $checkout = $this->jsLayoutParser->parse($jsLayout, 'checkout');

        if ($this->helper->isCheckoutCustomizerEnabled()) {

            $checkout->setConfig([
                "checkoutCustomizerActive" => true
            ]);

            /**
             * @var string $layout
             */
            $layout = $this->helper->getLayout();
            switch ($layout) {
                case 'onestep_onecolumn':
                    $this->useOneStep($checkout);
                    break;
                case 'onestep_twocolumns':
                    $this->useOneStep($checkout);
                    $this->updateSidebar($checkout);
                    break;
                case 'twosteps':
                    $checkout->getChild('steps')->setConfig([
                        'hasSteps' => true
                    ]);
                    $shipping = $checkout->getNestedChild('steps.shipping-step.shippingAddress');
                    $shippingConfig = $shipping->getConfig();
                    $shippingConfig['showNextStepCta'] = true;
                    $shipping->setConfig($shippingConfig);
                    break;
                default:
                    break;
            }

            $this->updateBillingAddress($checkout, $layout);

        } else {
            $checkout->setConfig([
                "checkoutCustomizerActive" => false
            ]);
        }

        $jsLayout['components']['checkout'] = $checkout->asArray();
        return $jsLayout;
    }

    /**
     * @param ComponentInterface $checkout
     */
    public function updateSidebar($checkout) {
        $summaryContainerData = [
            'component' => 'uiComponent',
            'config' => [
                'template' => 'Dadolun_Checkout/summary',
                'options' => [],
                'id' => 'summary-container'
            ],
            'dataScope' => '',
            'label' => 'Summary Container',
            'provider' => 'checkoutProvider',
            'visible' => true,
            'validation' => [],
            'sortOrder' => 100,
            'id' => 'summary-container'
        ];
        $summaryContainer = $this->componentFactory->create(['componentName' => 'summary-container', 'data' => $summaryContainerData]);
        $checkout->getNestedChild('steps')->addChild($summaryContainer);
        $checkout->getNestedChild('sidebar.summary')->setConfig([
            'displayArea' => 'paymentSummary'
        ]);
        $checkout->moveNestedChild('sidebar.summary', 'steps.summary-container');
        $checkout->getChild('sidebar')->remove();
    }

    /**
     * @param ComponentInterface $checkout
     * @return Component
     */
    public function createBillingAddressContainer($checkout) {
        $checkout->getNestedChild('steps.billing-step.payment.afterMethods.billing-address-form')->setConfig([
            'displayArea' => 'billingAddress'
        ]);
        $billingAddressFormContainerData = [
            'component' => 'uiComponent',
            'config' => [
                'template' => 'Dadolun_Checkout/billing',
                'options' => [],
                'id' => 'billing-address-form-container'
            ],
            'dataScope' => '',
            'label' => 'Billing Address Form Container',
            'provider' => 'checkoutProvider',
            'visible' => true,
            'validation' => [],
            'sortOrder' => 10,
            'id' => 'billing-address-form-container'
        ];
        return $this->componentFactory->create(['componentName' => 'billing-address-form-container', 'data' => $billingAddressFormContainerData]);
    }

    /**
     * @param ComponentInterface $checkout
     * @param string $layout
     */
    public function updateBillingAddress($checkout, $layout) {
        if (!$this->checkoutDataHelper->isDisplayBillingOnPaymentMethodAvailable()) {
            $billingAddressFormContainer = $this->createBillingAddressContainer($checkout);
            if ($this->helper->moveBillingOutsidePayment()) {
                if ($layout === "onestep") {
                    $checkout->getNestedChild('steps.billing-step')->addChild($billingAddressFormContainer);
                    $checkout->moveNestedChild('steps.billing-step.payment.afterMethods.billing-address-form', 'steps.billing-step.billing-address-form-container');
                    $checkout->getChild('steps')->setConfig([
                        'billingFormPath' => 'checkout.steps.billing-step.billing-address-form-container.billing-address-form.form-fields.'
                    ]);
                } else {
                    $billingAddressFormContainer->setConfig([
                        'displayArea' => 'beforeMethods'
                    ]);
                    $checkout->getNestedChild('steps.billing-step.payment')->addChild($billingAddressFormContainer);
                    $checkout->moveNestedChild('steps.billing-step.payment.afterMethods.billing-address-form', 'steps.billing-step.payment.billing-address-form-container');
                    $checkout->getChild('steps')->setConfig([
                        'billingFormPath' => 'checkout.steps.billing-step.payment.billing-address-form-container.billing-address-form.form-fields.'
                    ]);
                }
            } else {
                $checkout->getChild('steps')->setConfig([
                    'billingFormPath' => 'checkout.steps.billing-step.payment.afterMethods.billing-address-form.form-fields.'
                ]);
            }
        } else {
            $checkout->getChild('steps')->setConfig([
                'billingFormPath' => 'checkout.steps.billing-step.payment.payments-list'
            ]);
        }
    }

    /**
     * @param ComponentInterface $checkout
     * @return mixed
     * @throws LocalizedException
     */
    public function useOneStep(ComponentInterface $checkout)
    {
        if ($checkout->hasChild('progressBar')) {
            $checkout->removeChild('progressBar');
        }
        if (
            $checkout->hasChild('steps') &&
            $checkout->hasNestedChild('steps.shipping-step.shippingAddress') &&
            $checkout->hasNestedChild('steps.billing-step.payment')
        ) {
            $checkout->getNestedChild('steps')->setConfig([
                'hasSteps' => false
            ]);
            $shipping = $checkout->getNestedChild('steps.shipping-step.shippingAddress');
            $shippingConfig = $shipping->getConfig();
            $shippingConfig['showNextStepCta'] = false;
            $shipping->setConfig($shippingConfig);
        }
        if (
            $checkout->hasChild('sidebar') &&
            $checkout->hasNestedChild('sidebar.shipping-information')
        ) {
            $checkout->removeNestedChild('sidebar.shipping-information');
        }
    }
}
