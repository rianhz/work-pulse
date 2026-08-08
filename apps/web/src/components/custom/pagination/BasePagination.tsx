"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // Optional: how many pages to show around the current page
}

export function BasePagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const items: React.ReactNode[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        totalPages > 5 &&
        i !== 1 &&
        i !== totalPages &&
        Math.abs(i - currentPage) > siblingCount
      ) {
        if (i === 2 && currentPage > siblingCount + 2) {
          items.push(
            <PaginationItem key="start-ellipsis">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        if (i === totalPages - 1 && currentPage < totalPages - siblingCount - 1) {
          items.push(
            <PaginationItem key="end-ellipsis">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        continue;
      }

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            className="cursor-pointer select-none"
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`cursor-pointer select-none ${
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            className={`cursor-pointer select-none ${
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}