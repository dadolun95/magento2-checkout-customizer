<?php
/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
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
                case Config::ONESTEPLAYOUT_ONECOLUMN:
                    $this->useOneStep($checkout);
                    break;
                case Config::ONESTEPLAYOUT_TWOCOLUMNS:
                case Config::ONESTEPLAYOUT_THREECOLUMNS:
                    $this->useOneStep($checkout);
                    $this->updateSidebar($checkout);
                    break;
                case Config::TWOSTEPLAYOUT:
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
     * @throws LocalizedException
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
     * @return Component|false
     */
    public function createBillingAddressContainer($checkout) {
        if ($checkout->hasNestedChild('steps.billing-step.payment.afterMethods.billing-address-form')) {
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
        return false;
    }

    /**
     * @param ComponentInterface $checkout
     * @param string $layout
     * @throws LocalizedException
     */
    public function updateBillingAddress($checkout, $layout) {
        if (!$this->checkoutDataHelper->isDisplayBillingOnPaymentMethodAvailable()) {
            $billingAddressFormContainer = $this->createBillingAddressContainer($checkout);
            if ($this->helper->moveBillingOutsidePayment()) {
                if (in_array($layout, [Config::ONESTEPLAYOUT_ONECOLUMN, Config::ONESTEPLAYOUT_TWOCOLUMNS, Config::ONESTEPLAYOUT_THREECOLUMNS])) {
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
