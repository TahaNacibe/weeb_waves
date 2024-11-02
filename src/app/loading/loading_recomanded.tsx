import React from 'react';
import { LayoutDashboard } from 'lucide-react';


export default function LoadingRecommended() {
  const loadingItem = () => {
    return (
      <div className="px-1 w-2/6">
        {/* image holder section */}
        <div className=" h-56 bg-gray-300 dark:bg-gray-600 w-full flex items-center justify-center">
        <LayoutDashboard size={50} />
        </div>
        
        {/* title section */}
        <div className="h-16 bg-gray-300 dark:bg-gray-800 p-4 w-full">
          <div className="flex items-center w-full">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
          </div>
        </div>
      </div>  
    );
  };

  return (
    <div className="p-4">
      <div role="status" className=" animate-pulse flex gap-1">
        {loadingItem()}
        {loadingItem()}
        {loadingItem()}
      </div>
    </div>
  );
}


