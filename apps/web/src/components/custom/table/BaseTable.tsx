"use client";

import * as React from "react";
import {
  ColumnDef,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, X, ChevronDown, LucideIcon } from "lucide-react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { BasePagination } from "@/components/custom/pagination/BasePagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyData } from "../errors-and-empty/EmptyData";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

export interface BulkActionItem<TData> {
  label: string;
  icon?: LucideIcon;
  onClick: (selectedRows: TData[]) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface BaseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnLabels?: Record<string, string>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: React.Dispatch<React.SetStateAction<VisibilityState>>;
  
  // Row Selection & Bulk Actions
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  bulkActions?: BulkActionItem<TData>[];

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
  columns: userColumns,
  data,
  columnLabels = {},
  columnVisibility = {},
  onColumnVisibilityChange,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  bulkActions = [],
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
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});

  const isControlledVisibility = onColumnVisibilityChange !== undefined;
  const currentVisibility = isControlledVisibility ? columnVisibility : internalVisibility;
  const handleVisibilityChange = isControlledVisibility ? onColumnVisibilityChange : setInternalVisibility;

  const isControlledSelection = onRowSelectionChange !== undefined;
  const currentSelection = isControlledSelection ? (rowSelection ?? {}) : internalRowSelection;
  const handleSelectionChange = isControlledSelection ? onRowSelectionChange : setInternalRowSelection;

  // Selection Column Definition
  const columns = React.useMemo(() => {
    if (!enableRowSelection) return userColumns;

    const selectColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="cursor-pointer"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn, ...userColumns];
  }, [enableRowSelection, userColumns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility: currentVisibility,
      rowSelection: currentSelection,
    },
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: handleVisibilityChange,
    onRowSelectionChange: handleSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  // Render Single Action Button or Actions Dropdown
  const renderBulkActionsControl = () => {
    if (bulkActions.length === 0) return null;

    if (bulkActions.length === 1) {
      const action = bulkActions[0];
      return (
        <Button
          variant={action.variant || "default"}
          size="sm"
          onClick={() => action.onClick(selectedRows)}
          icon={action.icon}
          iconPosition="left"
        >
          {action.label}
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" className="gap-2">
            Actions
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {bulkActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={idx}
                onClick={() => action.onClick(selectedRows)}
                className="gap-2 cursor-pointer"
              >
                {Icon && <Icon className="size-4" />}
                <span>{action.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <Card className="pt-4 pb-0 ring-0 overflow-hidden gap-4">
      {/* Top Header / Actions Container */}
      <div className="relative mb-0 flex min-h-[48px] items-center justify-between overflow-hidden px-4 py-1">
        
        {/* 1. Standard Header Bar (Always present in the background) */}
        <div className="flex w-full items-center justify-between gap-4">
          <React.Activity mode={showSearchField ? "visible" : "hidden"}>
            <InputGroup className="max-w-lg">
              <InputGroupInput 
                placeholder={searchPlaceholder} 
                value={searchValue} 
                onChange={(e) => onSearchChange?.(e.target.value)}
                disabled={isLoading}
              />
            </InputGroup>
          </React.Activity>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto flex gap-2" disabled={isLoading} icon={SlidersHorizontal} iconPosition="left">
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

        {/* 2. Floating Selection Banner (Slides in over the top) */}
        <AnimatePresence>
          {enableRowSelection && selectedCount > 0 && (
            <motion.div
              key="selection-banner"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 left-0 right-0 z-10 flex items-center bg-card px-4"
            >
              <div className="flex w-full items-center justify-between rounded-md bg-primary px-4 h-12 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary-foreground">
                    {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {renderBulkActionsControl()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="overflow-x-auto relative">
        <React.Activity mode={isLoading ? "visible" : "hidden"}>
          <div className="flex justify-center items-center min-h-[200px]"> <Spinner className="size-10" /> </div>
        </React.Activity>
        <React.Activity mode={!isLoading && isEmptyData ? "visible" : "hidden"}>
          <EmptyData description={emptyDataDescription} icon={emptyDataIcon} />
        </React.Activity>
        <React.Activity mode={!isLoading && !isEmptyData ? "visible" : "hidden"}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isActions = header.column.id === "actions";
                    const isSelect = header.column.id === "select";
                    return (
                      <TableHead
                        key={header.id}
                        className={
                          isActions
                            ? "sticky right-0 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 text-right w-[100px]"
                            : isSelect
                            ? "w-12 text-center px-2"
                            : "px-4"
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
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClicked?.(row.original)} 
                  className={onRowClicked ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActions = cell.column.id === "actions";
                    const isSelect = cell.column.id === "select";
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          isActions
                            ? "sticky right-0 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 text-right"
                            : isSelect
                            ? "w-12 text-center px-2"
                            : "p-4"
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
        </React.Activity>
      </div>

      <React.Activity mode={currentPage !== undefined && onPageChange && totalPages > 1 ? "visible" : "hidden"}>
        <div className="pt-2">
          <BasePagination 
            currentPage={currentPage || 1} 
            totalPages={totalPages} 
            onPageChange={onPageChange || (() => {})} 
          />
        </div>
      </React.Activity>
    </Card>
  );
}