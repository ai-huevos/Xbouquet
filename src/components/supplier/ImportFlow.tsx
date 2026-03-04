'use client'

import React, { useState } from 'react'
import Papa from 'papaparse'
import { ProductCategory } from '@/types/products'
import { CsvUploader } from './CsvUploader'
import { ColumnMapper } from './ColumnMapper'
import { ImportReview } from './ImportReview'

interface ImportFlowProps {
    categories: ProductCategory[];
}

type Step = 'upload' | 'map' | 'review';

export function ImportFlow({ categories }: ImportFlowProps) {
    const [currentStep, setCurrentStep] = useState<Step>('upload');
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});

    const handleFileSelect = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.meta.fields) {
                    setCsvHeaders(results.meta.fields);
                    setParsedData(results.data);
                    setCurrentStep('map');
                } else {
                    alert('Failed to read CSV headers. Please ensure your file has a header row.');
                }
            },
            error: (error) => {
                alert('Error parsing CSV: ' + error.message);
            }
        });
    };

    const handleMappingComplete = (newMapping: Record<string, string>) => {
        setMapping(newMapping);
        setCurrentStep('review');
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Stepper */}
            <nav aria-label="Progress" className="mb-8">
                <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                    <li className="md:flex-1">
                        <div className={`group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 ${currentStep === 'upload' ? 'border-primary' : 'border-gray-200'}`}>
                            <span className={`text-xs text-primary font-semibold tracking-wide uppercase ${currentStep === 'upload' ? 'text-primary' : 'text-gray-500'}`}>Step 1</span>
                            <span className="text-sm font-medium">Upload CSV</span>
                        </div>
                    </li>
                    <li className="md:flex-1">
                        <div className={`group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 ${currentStep === 'map' ? 'border-primary' : 'border-gray-200'}`}>
                            <span className={`text-xs text-primary font-semibold tracking-wide uppercase ${currentStep === 'map' ? 'text-primary' : 'text-gray-500'}`}>Step 2</span>
                            <span className="text-sm font-medium">Map Columns</span>
                        </div>
                    </li>
                    <li className="md:flex-1">
                        <div className={`group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 ${currentStep === 'review' ? 'border-primary' : 'border-gray-200'}`}>
                            <span className={`text-xs text-primary font-semibold tracking-wide uppercase ${currentStep === 'review' ? 'text-primary' : 'text-gray-500'}`}>Step 3</span>
                            <span className="text-sm font-medium">Review & Import</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Constraints for flow */}
            {currentStep === 'upload' && (
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
                        Bulk Import Products
                    </h2>
                    <CsvUploader onFileSelect={handleFileSelect} />
                </div>
            )}

            {currentStep === 'map' && (
                <ColumnMapper
                    csvHeaders={csvHeaders}
                    categories={categories}
                    onMappingComplete={handleMappingComplete}
                />
            )}

            {currentStep === 'review' && (
                <ImportReview
                    parsedData={parsedData}
                    mapping={mapping}
                    onBack={() => setCurrentStep('map')}
                />
            )}
        </div>
    )
}
