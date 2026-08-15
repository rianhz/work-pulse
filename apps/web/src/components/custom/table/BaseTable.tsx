"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { BasePagination } from "@/components/custom/pagination/BasePagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyData } from "../errors-and-empty/EmptyData";
import { Card } from "@/components/ui/card";

interface BaseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnLabels?: Record<string, string>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: React.Dispatch<React.SetStateAction<VisibilityState>>;

  showSearchField?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  isLoading?: boolean;
  isEmptyData?: boolean;
  emptyDataDescription?: string;
  emptyDataIcon?: React.ReactNode;
  onRowClicked?: (row: TData) => void;
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  columnLabels = {},
  columnVisibility = {},
  onColumnVisibilityChange,
  showSearchField = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Searching...",
  currentPage,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  isEmptyData = false,
  emptyDataDescription = "No data found",
  emptyDataIcon = <Table className="size-10 text-muted-foreground" />,
  onRowClicked,
}: BaseTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalVisibility, setInternalVisibility] = React.useState<VisibilityState>({});

  const isControlledVisibility = onColumnVisibilityChange !== undefined;
  const currentVisibility = isControlledVisibility ? columnVisibility : internalVisibility;
  const handleVisibilityChange = isControlledVisibility ? onColumnVisibilityChange : setInternalVisibility;

  const processedColumns = React.useMemo(() => {
    return columns.map((col) => {
      const isSortable = col.enableSorting !== false && col.enableSorting !== undefined;
      const OriginalHeader = col.header;

      if (!isSortable || !OriginalHeader) {
        return col;
      }

      return {
        ...col,
        header: (headerProps: any) => {
          const sorted = headerProps.column.getIsSorted();
          
          // These are morphicon data objects from "lucide"
          const currentMorphIcon =
            sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

          const headerContent = flexRender(OriginalHeader, headerProps);

          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => headerProps.column.toggleSorting(sorted === "asc")}
              className="-ml-3 h-8 hover:bg-transparent font-semibold data-[state=open]:bg-accent"
              icon={currentMorphIcon}
              iconPosition="right"
              iconClassName="size-3.5 opacity-70"
              enableIconTransition={true}
            >
              {headerContent}
            </Button>
          );
        },
      };
    }) as ColumnDef<TData, TValue>[];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: processedColumns,
    state: {
      sorting,
      columnVisibility: currentVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: handleVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="space-y-4 py-4 ring-0">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between gap-4 px-4 mb-0">
        {showSearchField && (
          <InputGroup className="max-w-lg">
            <InputGroupInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              disabled={isLoading}
            />
          </InputGroup>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto flex gap-2"
              disabled={isLoading}
              icon={SlidersHorizontal}
              iconPosition="left"
            >
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabels[column.id] || column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto relative">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner className="size-10" />
          </div>
        ) : isEmptyData ? (
          <EmptyData description={emptyDataDescription} icon={emptyDataIcon} />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isActions = header.column.id === "actions";
                    return (
                      <TableHead
                        key={header.id}
                        className={
                          isActions
                            ? "sticky right-0 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 text-right w-[100px] bg-popover"
                            : ""
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClicked?.(row.original)}
                  className={onRowClicked ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActions = cell.column.id === "actions";
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          isActions
                            ? "sticky right-0 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 text-right bg-popover"
                            : ""
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {currentPage !== undefined && onPageChange && totalPages > 1 && (
        <div className="pt-2">
          <BasePagination
            currentPage={currentPage || 1}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </Card>
  );
}