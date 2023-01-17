<?php
/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
 */

declare(strict_types=1);

namespace Dadolun\Checkout\Observer;

use Dadolun\Checkout\Helper\Config;
use Magento\Framework\Event\Observer;
use Magento\Framework\View\Layout;

/**
 * Class PreparePageLayout
 * @package Dadolun\Checkout\Observer
 */
class PreparePageLayout implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * @var Config
     */
    protected $helper;

    /**
     * PreparePageLayout constructor.
     * @param Config $helper
     */
    public function __construct(
        Config $helper
    ) {
        $this->helper = $helper;
    }

    /**
     * @param Observer $observer
     */
    public function execute(Observer $observer)
    {
        if ($this->helper->isCheckoutCustomizerEnabled()) {
            /**
             * @var Layout $layout
             */
            $layout = $observer->getLayout();
            if ($observer->getFullActionName() !== "checkout_index_index") {
                return;
            }

            switch ($this->helper->getPageLayout()) {
                case 'empty':
                    $layout->getUpdate()->addHandle('checkout_layout_empty');
                    break;
                case 'minimal':
                    $layout->getUpdate()->addHandle('checkout_layout_minimal');
                    break;
                default:
                    break;
            }

            if ($this->helper->getLayout() && strpos($this->helper->getLayout(), "onestep") !== false) {
                $checkoutLayoutHandle = 'checkout_layout_' . $this->helper->getLayout();
                $layout->getUpdate()->addHandle($checkoutLayoutHandle);
            }
        }
    }
}
