import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="group relative flex-[1] overflow-hidden border-r last:border-0 border-white/10 animate-pulse">
      <div className="absolute inset-0 bg-nude-200" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
        <div className="pb-12">
          <div className="h-3 bg-white/20 rounded mb-4 w-24"></div>
          <div className="h-8 lg:h-12 bg-white/20 rounded mb-4 w-48"></div>
          <div className="flex items-center gap-6">
            <div className="h-6 bg-white/20 rounded w-20"></div>
            <div className="w-12 h-12 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-[70vh] lg:h-[80vh] overflow-hidden">
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </div>
  );
};