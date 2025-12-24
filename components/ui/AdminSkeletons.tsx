import React from "react";

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-10 py-8">
        <div className="h-4 bg-nude-200 rounded w-12"></div>
      </td>
      <td className="px-10 py-8">
        <div className="h-4 bg-nude-200 rounded w-32"></div>
      </td>
      <td className="px-10 py-8">
        <div className="h-4 bg-nude-200 rounded w-40"></div>
      </td>
      <td className="px-10 py-8">
        <div className="h-4 bg-nude-200 rounded w-16"></div>
      </td>
      <td className="px-10 py-8">
        <div className="h-3 bg-nude-200 rounded w-20"></div>
      </td>
      <td className="px-10 py-8 text-right">
        <div className="h-8 w-8 bg-nude-200 rounded-full ml-auto"></div>
      </td>
    </tr>
  );
};

export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 rounded-[3rem] border border-nude-100 shadow-sm space-y-4 animate-pulse bg-white">
      <div className="h-4 bg-nude-200 rounded w-32"></div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="h-8 lg:h-10 bg-nude-200 rounded w-24"></div>
        <div className="h-4 bg-nude-200 rounded w-12"></div>
      </div>
    </div>
  );
};

export const InventoryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[3rem] p-8 border border-nude-100 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="h-6 bg-nude-200 rounded w-48"></div>
          <div className="h-4 bg-nude-200 rounded w-32"></div>
        </div>
        <div className="h-20 w-20 bg-nude-200 rounded-2xl"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-nude-200 rounded w-full"></div>
        <div className="h-4 bg-nude-200 rounded w-3/4"></div>
        <div className="h-4 bg-nude-200 rounded w-1/2"></div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="h-6 bg-nude-200 rounded w-16"></div>
        <div className="h-8 bg-nude-200 rounded w-20"></div>
      </div>
    </div>
  );
};
