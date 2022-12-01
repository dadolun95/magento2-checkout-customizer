<?php
/**
* @package     Dadolun_Checkout
* @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
 * @license     Open Source License
*/

declare(strict_types=1);

namespace Dadolun\Checkout\Model\Config\Source;

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
            ['value' => 'twosteps', 'label' => __('Two steps (default)')],
            ['value' => 'onestep', 'label' => __('One step')]
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
