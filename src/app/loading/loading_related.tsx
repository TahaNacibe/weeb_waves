import React from 'react';
import { LayoutDashboard } from 'lucide-react';


export default function LoadingRelatedWidget() {
  const loadingItem = () => {
    return (
      <div className="px-4 py-1 flex flex-row">
        {/* image holder section */}
            <div className=" bg-gray-300 dark:bg-gray-600 w-full flex items-center justify-center p-6 rounded-md">
        <LayoutDashboard size={25} />
        </div>
        
        {/* title section */}
        <div className=" p-4 w-full">
          <div className="flex flex-col gap-2 items-center w-full">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
          </div>
        </div>
      </div>  
    );
  };

  return (
    <div className="">
      <div role="status" className=" animate-pulse flex flex-col gap-1">
        {loadingItem()}
        {loadingItem()}
        {loadingItem()}
      </div>
    </div>
  );
}


