'use client'

import React, { useCallback, useState } from 'react'

interface CsvUploaderProps {
    onFileSelect: (file: File) => void;
}

export function CsvUploader({ onFileSelect }: CsvUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                onFileSelect(file);
            } else {
                alert('Please upload a valid CSV file.');
            }
        }
    }, [onFileSelect]);

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                    <svg className="w-8 h-8 text-primary" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                </div>
                <div className="text-lg font-medium text-gray-900">
                    Drag and drop your CSV file here
                </div>
                <p className="text-sm text-gray-500">
                    or click to browse from your computer
                </p>
                <label className="mt-4 cursor-pointer">
                    <input
                        type="file"
                        className="hidden"
                        accept=".csv,text/csv"
                        onChange={handleChange}
                    />
                    <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 shadow-sm transition-colors">
                        Select File
                    </span>
                </label>
            </div>
        </div>
    )
}
