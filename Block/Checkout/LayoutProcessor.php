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
        if ($this->helper->isCheckoutCustomizerEnabled()) {

            /** @var ComponentInterface $checkout */
            $checkout = $this->jsLayoutParser->parse($jsLayout, 'checkout');

            if (!$this->checkoutDataHelper->isDisplayBillingOnPaymentMethodAvailable()) {
                if ($this->helper->moveBillingOutsidePayment()) {
                    if ($checkout->hasNestedChild('steps.billing-step.payment.afterMethods.billing-address-form')) {
                        $checkout->getNestedChild('steps.billing-step.payment.afterMethods.billing-address-form')->setDisplayArea('billing-address-form');
                        $checkout->moveNestedChild('steps.billing-step.payment.afterMethods.billing-address-form', 'steps.shipping-step.shippingAddress');
                        $checkout->getChild('steps')->setConfig([
                            'billingFormPath' => 'checkout.steps.shipping-step.shippingAddress.billing-address-form.form-fields.'
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

            switch ($this->helper->getLayout()) {
                case 'onestep':
                    $checkout = $this->useOneStep($checkout);
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
            $jsLayout['components']['checkout'] = $checkout->asArray();
        }

        return $jsLayout;
    }

    /**
     * @param ComponentInterface $checkout
     * @return mixed
     * @throws LocalizedException
     */
    private function useOneStep(ComponentInterface $checkout)
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
        return $checkout;
    }
}
