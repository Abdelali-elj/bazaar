"use client";
import React from 'react';

export default function ProductSkeleton() {
    return (
        <div className="space-y-6">
            <div className="aspect-[4/5] w-full rounded-[2.5rem] skeleton-shimmer" />
            <div className="space-y-3">
                <div className="h-2 w-1/3 skeleton-shimmer rounded-full" />
                <div className="h-4 w-2/3 skeleton-shimmer rounded-full" />
                <div className="h-4 w-1/4 skeleton-shimmer rounded-full" />
            </div>
            <div className="flex gap-2">
                <div className="h-10 flex-grow skeleton-shimmer rounded-2xl" />
                <div className="h-10 w-12 skeleton-shimmer rounded-2xl" />
            </div>
        </div>
    );
}
