<?php
/**
 * @package     Dadolun_Checkout
 * @copyright   Copyright (c) 2022 Dadolun (https://github.com/dadolun95)
 * @license     Open Source License
 */

declare(strict_types=1);

namespace Dadolun\Checkout\Model\Config\Source;

/**
 * Class PageLayout
 * @package Dadolun\Checkout\Model\Config\Source
 */
class PageLayout implements \Magento\Framework\Option\ArrayInterface
{
    /**
     * @return array
     */
    public function toOptionArray()
    {
        return [
            ['value' => 'default', 'label' => __('Default Layout')],
            ['value' => 'empty', 'label' => __('Empty (No Header and Footer)')],
            ['value' => 'minimal', 'label' => __('Minimal (Header with store Logo only)')],
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
