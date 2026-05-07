'use client';

import { useState, useCallback, useMemo } from 'react';
import { GripVertical, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { RuneTree, Rune, getRuneIconUrl } from '@/lib/lol/runes';
import { slotsToGrid, gridToSlots } from '@/lib/runes-utils';

interface RuneTreeEditorProps {
  tree: RuneTree;
  runes: Rune[];
  onSlotsChange: (slots: string[][]) => void;
}

export default function RuneTreeEditor({ tree, runes, onSlotsChange }: RuneTreeEditorProps) {
  const [dragSource, setDragSource] = useState<{ row: number; col: number; runeId: string } | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ row: number; col: number } | null>(null);

  const getRuneById = useCallback((runeId: string) => runes.find(r => r.id === runeId), [runes]);

  const grid = useMemo(() => slotsToGrid(tree.slots), [tree.slots]);

  const commitGrid = useCallback((newGrid: (string | null)[][]) => {
    const newSlots = gridToSlots(newGrid);
    onSlotsChange(newSlots);
  }, [onSlotsChange]);

  const handleDragStart = useCallback((e: React.DragEvent, runeId: string, row: number, col: number) => {
    setDragSource({ runeId, row, col });
    e.dataTransfer.setData('application/rune-id', runeId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ row, col });
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    setDragOverCell(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toRow: number, toCol: number) => {
    e.preventDefault();
    setDragOverCell(null);

    let runeId = dragSource?.runeId;
    if (!runeId) {
      runeId = e.dataTransfer.getData('application/rune-id');
    }
    
    if (!runeId) return;

    const currentGrid = slotsToGrid(tree.slots);
    const newGrid = currentGrid.map(row => [...row]);

    // Case 1: Dragging from outside (rune list)
    if (!dragSource) {
      // Remove rune from any existing position
      for (let r = 0; r < 4; r++) {
        const cols = r === 0 ? 4 : 3;
        for (let c = 0; c < cols; c++) {
          if (newGrid[r][c] === runeId) {
            newGrid[r][c] = null;
          }
        }
      }
      // Place at drop position
      newGrid[toRow][toCol] = runeId;
      commitGrid(newGrid);
      return;
    }

    // Case 2: Dragging from within the grid
    const { row: fromRow, col: fromCol } = dragSource;
    
    // Same cell - do nothing
    if (fromRow === toRow && fromCol === toCol) {
      setDragSource(null);
      return;
    }

    const targetRuneId = newGrid[toRow][toCol];

    // Swap the runes
    newGrid[toRow][toCol] = runeId;
    newGrid[fromRow][fromCol] = targetRuneId;

    commitGrid(newGrid);
    setDragSource(null);
  }, [dragSource, tree.slots, commitGrid]);

  const handleDragEnd = useCallback(() => {
    setDragSource(null);
    setDragOverCell(null);
  }, []);

  const handleClearCell = useCallback((row: number, col: number) => {
    const currentGrid = slotsToGrid(tree.slots);
    const newGrid = currentGrid.map(r => [...r]);
    newGrid[row][col] = null;
    commitGrid(newGrid);
  }, [tree.slots, commitGrid]);

  const handleClearRow = useCallback((row: number) => {
    const currentGrid = slotsToGrid(tree.slots);
    const newGrid = currentGrid.map(r => [...r]);
    const cols = row === 0 ? 4 : 3;
    for (let col = 0; col < cols; col++) newGrid[row][col] = null;
    commitGrid(newGrid);
  }, [tree.slots, commitGrid]);

  const ROW_LABELS = ['Keystones', 'Row 1', 'Row 2', 'Row 3'];

  return (
    <div className="space-y-8">
      {/* Grid */}
      <div className="space-y-0">
        {grid.map((row, rowIndex) => {
          const isPrimaryRow = rowIndex === 0;
          return (
            <div key={rowIndex}>
              <div className={`py-6 ${isPrimaryRow ? 'bg-transparent' : 'bg-transparent'}`}>
                {/* Row header with clear button */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-semibold ${isPrimaryRow ? 'text-orange-400/70' : 'text-zinc-400'}`}>
                      {ROW_LABELS[rowIndex]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-lg ${
                      isPrimaryRow 
                        ? 'bg-orange-500/10 text-orange-400/70 border border-orange-500/20' 
                        : 'bg-zinc-800/60 text-zinc-400'
                    }`}>
                      {row.filter(id => id !== null).length}/{isPrimaryRow ? 4 : 3}
                    </span>
                    <button
                      onClick={() => handleClearRow(rowIndex)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                        isPrimaryRow
                          ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400/70'
                          : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400/70'
                      }`}
                    >
                      Clear Row
                    </button>
                  </div>
                </div>

                {/* Slots */}
                <div className={`${isPrimaryRow ? 'grid grid-cols-4' : 'grid grid-cols-3'} gap-4 px-2`}>
                  {row.map((runeId, colIndex) => {
                    if (!isPrimaryRow && colIndex >= 3) return null;
                    const rune = runeId ? getRuneById(runeId) : null;
                    const occupied = runeId !== null;
                    const isDragOver = dragOverCell?.row === rowIndex && dragOverCell?.col === colIndex;
                    const isDragging = dragSource?.row === rowIndex && dragSource?.col === colIndex;

                    return (
                      <div
                        key={colIndex}
                        draggable={occupied}
                        onDragStart={occupied ? (e) => handleDragStart(e, runeId!, rowIndex, colIndex) : undefined}
                        onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                        onDragEnd={handleDragEnd}
                        className={`
                          relative min-h-[80px] rounded-2xl transition-all cursor-pointer
                          ${isPrimaryRow && occupied
                            ? 'bg-orange-500/10 border border-orange-500/30 shadow-sm shadow-orange-500/5'
                            : isPrimaryRow && !occupied
                              ? 'bg-orange-500/5 border border-dashed border-orange-500/20 hover:border-orange-500/30 hover:bg-orange-500/10'
                              : occupied
                                ? 'bg-zinc-800/40 hover:bg-zinc-800/50'
                                : 'bg-zinc-800/20 border border-dotted border-orange-500/20 hover:border-orange-500/30 hover:bg-zinc-800/30'
                          }
                          ${isDragOver ? 'ring-2 ring-orange-500/50 scale-[0.98]' : ''}
                          ${isDragging ? 'opacity-40' : ''}
                          cursor-${occupied ? 'grab' : 'pointer'}
                        `}
                      >
                        {occupied && rune ? (
                          <div className={`p-3 h-full flex flex-col items-center justify-center relative group ${isPrimaryRow ? 'bg-gradient-to-br from-orange-500/5 to-transparent' : ''}`}>
                            {/* Drag handle */}
                            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg bg-black/40 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing">
                              <GripVertical className="w-3 h-3 text-zinc-400" />
                            </div>

                            {/* Clear button */}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleClearCell(rowIndex, colIndex); }}
                              className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                              title="Remove rune"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>

                            {/* Position badge */}
                            <div className={`absolute top-2 left-2 w-5 h-5 rounded-lg flex items-center justify-center ${
                              isPrimaryRow ? 'bg-orange-500/20' : 'bg-black/40'
                            }`}>
                              <span className={`text-[8px] font-bold ${isPrimaryRow ? 'text-orange-400/70' : 'text-zinc-400'}`}>
                                {colIndex + 1}
                              </span>
                            </div>

                            {/* Icon */}
                            <div className="flex items-center justify-center mb-2">
                              {rune.icon_path ? (
                                <img
                                  src={getRuneIconUrl(rune.icon_path)}
                                  alt={rune.name}
                                  className={`rounded-xl object-cover transition-transform group-hover:scale-105 ${
                                    isPrimaryRow ? 'w-14 h-14' : 'w-12 h-12'
                                  }`}
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : (
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  rune.is_keystone ? 'bg-orange-500/15' : 'bg-zinc-800'
                                }`}>
                                  <Plus className="w-5 h-5 text-zinc-500" />
                                </div>
                              )}
                            </div>

                            {/* Name */}
                            <p className={`text-sm font-semibold text-white truncate max-w-[90px] text-center leading-tight ${
                              isPrimaryRow ? 'text-orange-300/80' : ''
                            }`}>
                              {rune.name}
                            </p>
                          </div>
                        ) : (
                          <div className={`h-full flex flex-col items-center justify-center transition-colors ${
                            isPrimaryRow ? 'text-orange-500/40 group-hover:text-orange-500/60' : 'text-zinc-600 group-hover:text-orange-500/50'
                          }`}>
                            <Plus className="w-5 h-5 opacity-30 group-hover:opacity-60 transition-opacity" />
                            <span className="text-[10px] mt-2 font-medium">
                              {isPrimaryRow ? `Slot ${colIndex + 1}` : `Slot ${colIndex + 1}`}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Gradient separator between rows */}
              {rowIndex < 3 && (
                <div className="w-full px-6">
                  <div className={`h-px w-full bg-gradient-to-r from-transparent via-${
                    rowIndex === 0 ? 'orange-500/30' : 'orange-500/15'
                  } to-transparent`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hint */}
      <div className="text-xs text-zinc-500 text-center italic pt-4">
        Drag runes to move them between slots • Click × to remove
      </div>
    </div>
  );
}