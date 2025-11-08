
import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onDataLoaded: (data: any[], fileName: string) => void;
  onError: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
}

declare const Papa: any;

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, onError, setIsLoading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type === 'text/csv') {
      setIsLoading(true);
      onError('');
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          onDataLoaded(results.data, file.name);
          setIsLoading(false);
        },
        error: (error: any) => {
          onError(`CSV Parsing Error: ${error.message}`);
          setIsLoading(false);
        },
      });
    } else {
      onError('Please upload a valid .csv file.');
    }
  }, [onDataLoaded, onError, setIsLoading]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="text-center p-6 container mx-auto">
      <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="relative">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
            dragActive ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a2 2 0 012-2h10a2 2 0 012 2v6a4 4 0 01-4 4H7z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m12-12v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV file required</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleChange} />
        </label>
        {dragActive && (
          <div className="absolute top-0 left-0 w-full h-full" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>
        )}
      </form>
    </div>
  );
};
