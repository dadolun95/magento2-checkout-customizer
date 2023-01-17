<?php
/**
 * @category    Magento 2
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2023 Dadolun (https://www.dadolun.com)
 */

declare(strict_types=1);

namespace Dadolun\Checkout\Model\Config\Source;

use Dadolun\Checkout\Helper\Config;

/**
 * Class Layout
 * @package Dadolun\Checkout\Model\Config\Source
 */
class Layout implements \Magento\Framework\Data\OptionSourceInterface
{
    /**
     * @return array
     */
    public function toOptionArray()
    {
        return [
            ['value' => Config::TWOSTEPLAYOUT, 'label' => __('Two steps (default)')],
            ['value' => Config::ONESTEPLAYOUT_ONECOLUMN, 'label' => __('One step - One column')],
            ['value' => Config::ONESTEPLAYOUT_TWOCOLUMNS, 'label' => __('One step - Two columns')],
        ];
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $result = [];
        foreach ($this->toOptionArray() as $item) {
            $result[$item['value']] = $item['label'];
        }
        return $result;
    }
}
