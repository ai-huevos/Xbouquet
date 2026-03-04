'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { bulkCreateProducts } from '@/lib/actions/products'
import { BulkProductFormValues, bulkProductSchema } from '@/lib/validators/import'

interface ImportReviewProps {
    parsedData: any[];
    mapping: Record<string, string>;
    onBack: () => void;
}

export function ImportReview({ parsedData, mapping, onBack }: ImportReviewProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverResult, setServerResult] = useState<{ success?: boolean; error?: string; insertedCount?: number; errors?: string[] } | null>(null);

    // Transform data
    const transformedData: BulkProductFormValues[] = parsedData.map(row => {
        return {
            name: row[mapping['name']],
            category_id: row[mapping['category_id']],
            description: row[mapping['description']] || undefined,
            price_per_unit: row[mapping['price_per_unit']], // Will be coerced by Zod
            stock_qty: row[mapping['stock_qty']], // Will be coerced by Zod
        } as any;
    });

    // Validate preview (first 5)
    const previewData = transformedData.slice(0, 5);

    // Basic pre-validation on client just to see if there are catastrophic formatting errors
    let validationErrorsCount = 0;
    transformedData.forEach(item => {
        const res = bulkProductSchema.safeParse(item);
        if (!res.success) {
            validationErrorsCount++;
        }
    });

    const handleImport = () => {
        startTransition(async () => {
            setServerResult(null);
            try {
                const result = await bulkCreateProducts(transformedData);
                setServerResult(result);

                if (result.success) {
                    // Navigate to dashboard after short delay
                    setTimeout(() => {
                        router.push('/supplier/products');
                    }, 2000);
                }
            } catch (e: any) {
                setServerResult({ error: e.message || 'An unexpected error occurred.' });
            }
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Review Data</h3>
                <p className="mt-1 text-sm text-gray-500">
                    We found {transformedData.length} total rows. Please review the first 5 rows below.
                </p>
            </div>

            {validationErrorsCount > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-amber-700">
                                Warning: We detected potential validation errors in {validationErrorsCount} rows based on your mapping.
                                The server will attempt to skip invalid rows and insert the valid ones, or you can go back and fix the CSV.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {serverResult && serverResult.success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700 font-medium">
                                Successfully imported {serverResult.insertedCount} products. Redirecting to your dashboard...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {serverResult && serverResult.error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700 font-medium">
                                Import failed: {serverResult.error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((item, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{String(item.name || '')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">{String(item.category_id || '')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{String(item.price_per_unit || '')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{String(item.stock_qty || '')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center">
                <button
                    onClick={onBack}
                    disabled={isPending || (serverResult?.success ?? false)}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-2 px-6 rounded-md shadow drop-shadow-sm transition-colors disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleImport}
                    disabled={isPending || (serverResult?.success ?? false)}
                    className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-md shadow drop-shadow-sm transition-colors disabled:opacity-50 flex items-center"
                >
                    {isPending ? 'Importing...' : `Import ${transformedData.length} Products`}
                </button>
            </div>
        </div>
    )
}
