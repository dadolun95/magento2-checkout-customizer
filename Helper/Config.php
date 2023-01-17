<?php
/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
 */

declare(strict_types=1);

namespace Dadolun\Checkout\Helper;

use Magento\Store\Model\ScopeInterface;

/**
 * Class Config
 * @package Dadolun\Checkout\Helper
 */
class Config extends \Magento\Framework\App\Helper\AbstractHelper
{

    const ONESTEPLAYOUT_ONECOLUMN = "onestep_onecolumn";
    const ONESTEPLAYOUT_TWOCOLUMNS = "onestep_twocolumns";
    const TWOSTEPLAYOUT = "twosteps";

    /**
     * @var string
     */
    const CONFIG_PATH_GENERAL= 'dadolun_checkout/general';

    /**
     * @var string
     */
    const ENABLE_FIELD_PATH = '/enable';

    /**
     * @var string
     */
    const LAYOUT_FIELD_PATH = '/layout';

    /**
     * @var string
     */
    const PAGELAYOUT_FIELD_PATH = '/page_layout';

    /**
     * @var string
     */
    const MOVEBILLING_FIELD_PATH = '/move_billing_outside_payment';


    /**
     * @return string
     */
    public function isCheckoutCustomizerEnabled()
    {
        return $this->getConfigValue(self::CONFIG_PATH_GENERAL . self::ENABLE_FIELD_PATH);
    }

    /**
     * @return mixed
     */
    public function getLayout()
    {
        return $this->getConfigValue(self::CONFIG_PATH_GENERAL . self::LAYOUT_FIELD_PATH);
    }

    /**
     * @return mixed
     */
    public function getPageLayout()
    {
        return $this->getConfigValue(self::CONFIG_PATH_GENERAL . self::PAGELAYOUT_FIELD_PATH);
    }

    /**
     * @return mixed
     */
    public function moveBillingOutsidePayment() {
        return $this->getConfigValue(self::CONFIG_PATH_GENERAL . self::MOVEBILLING_FIELD_PATH);
    }

    /**
     * @param $path
     * @param string $scope
     * @return mixed
     */
    public function getConfigValue($path, $scope = ScopeInterface::SCOPE_STORE)
    {
        return $this->scopeConfig->getValue($path, $scope);
    }
}
