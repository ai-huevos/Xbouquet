'use client'

import React, { useState } from 'react'
import { ProductCategory } from '@/types/products'

interface ColumnMapperProps {
    csvHeaders: string[];
    onMappingComplete: (mapping: Record<string, string>) => void;
    categories: ProductCategory[];
}

const REQUIRED_FIELDS = [
    { key: 'name', label: 'Product Name' },
    { key: 'price_per_unit', label: 'Price (per unit)' },
    { key: 'stock_qty', label: 'Stock Quantity' },
    { key: 'category_id', label: 'Category ID (UUID)' },
];

const OPTIONAL_FIELDS = [
    { key: 'description', label: 'Description' },
];

export function ColumnMapper({ csvHeaders, onMappingComplete, categories }: ColumnMapperProps) {
    const [mapping, setMapping] = useState<Record<string, string>>({});

    const handleMap = (fieldKey: string, headerName: string) => {
        setMapping((prev) => ({
            ...prev,
            [fieldKey]: headerName,
        }));
    };

    const handleContinue = () => {
        // Validate required fields
        const missing = REQUIRED_FIELDS.filter((f) => !mapping[f.key]);
        if (missing.length > 0) {
            alert(`Please map the following required fields: ${missing.map(m => m.label).join(', ')}`);
            return;
        }
        onMappingComplete(mapping);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Map CSV Columns</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Select which column from your CSV corresponds to the required product fields.
                </p>
            </div>

            <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 border-b pb-2">Required Fields</h4>
                    {REQUIRED_FIELDS.map((field) => (
                        <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                value={mapping[field.key] || ''}
                                onChange={(e) => handleMap(field.key, e.target.value)}
                            >
                                <option value="">-- Select Column --</option>
                                {csvHeaders.map((header) => (
                                    <option key={header} value={header}>
                                        {header}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pt-4">
                    <h4 className="font-medium text-gray-900 border-b pb-2">Optional Fields</h4>
                    {OPTIONAL_FIELDS.map((field) => (
                        <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                value={mapping[field.key] || ''}
                                onChange={(e) => handleMap(field.key, e.target.value)}
                            >
                                <option value="">-- Select Column --</option>
                                {csvHeaders.map((header) => (
                                    <option key={header} value={header}>
                                        {header}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                <strong>Tip:</strong> For the Category ID field, you must provide the exact internal UUID of the category.
                Here are the available categories for reference:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    {categories.map(c => (
                        <li key={c.id}><strong>{c.name}</strong>: <code>{c.id}</code></li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleContinue}
                    className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-md shadow drop-shadow-sm transition-colors"
                >
                    Review Data
                </button>
            </div>
        </div>
    )
}
