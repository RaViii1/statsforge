'use client';

import { Rune } from '@/lib/lol/runes';


export function getRunePositionLegacy(
  slots: string[][],
  runeId: string
): { row: number; col: number } | null {
  for (let row = 0; row < slots.length; row++) {
    const col = slots[row].indexOf(runeId);
    if (col !== -1) {
      return { row, col };
    }
  }
  return null;
}


export function slotsToGrid(slots: string[][]): (string | null)[][] {
  const grid: (string | null)[][] = [
    [null, null, null, null], // Primary row - 4 slots
    [null, null, null],       // Row 1 - 3 slots
    [null, null, null],       // Row 2 - 3 slots
    [null, null, null],       // Row 3 - 3 slots
  ];

  // Row 0 (primary) - up to 4 runes
  if (Array.isArray(slots[0])) {
    for (let col = 0; col < Math.min(slots[0].length, 4); col++) {
      grid[0][col] = slots[0][col] || null;
    }
  }

  // Rows 1-3 - fill left to right (up to 3 each)
  for (let row = 1; row <= 3; row++) {
    const slot = slots[row] || [];
    for (let col = 0; col < 3; col++) {
      grid[row][col] = slot[col] || null;
    }
  }

  return grid;
}

export function gridToSlots(grid: (string | null)[][]): string[][] {
  const slots: string[][] = [[], [], [], []];

  // Row 0 - primary (up to 4 runes)
  if (grid[0]) {
    slots[0] = grid[0].filter((id): id is string => id !== null).slice(0, 4);
  }

  // Rows 1-3 - each gets up to 3 runes
  for (let row = 1; row <= 3; row++) {
    const rowData = grid[row] || [];
    slots[row] = rowData.filter((id): id is string => id !== null).slice(0, 3);
  }

  return slots;
}

export function getDefaultRunePosition(rune: Rune): { row: number; col: number } {
  if (rune.is_keystone) {
    return { row: 0, col: 0 };
  }
  // For non-keystones, position based on existing slot_position or default to row 1
  if (rune.slot_row !== undefined && rune.slot_col !== undefined) {
    return { row: rune.slot_row, col: rune.slot_col };
  }
  // Fallback: assign to first available slot in order
  return { row: 1, col: 0 };
}

export function isValidPlacement(
  rune: Rune,
  row: number,
  col: number
): boolean {

  return true;
}


export function moveRuneInGrid(
  grid: (string | null)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  runesMap: Map<string, Rune>
): (string | null)[][] | null {
  const newGrid = grid.map(row => [...row]);

  const runeId = newGrid[fromRow][fromCol];
  if (!runeId) return null;

  const rune = runesMap.get(runeId);
  if (!rune) return null;

  // Check if target slot is within bounds
  const targetMaxCol = toRow === 0 ? 4 : 3;
  if (toCol >= targetMaxCol) return null;
  
  // Source bounds check
  const sourceMaxCol = fromRow === 0 ? 4 : 3;
  if (fromCol >= sourceMaxCol) return null;

  // Check if target slot is occupied (swap allowed)
  const targetRuneId = newGrid[toRow][toCol];
  if (targetRuneId) {
    // Allow swapping between any slots
    const targetRune = runesMap.get(targetRuneId);
    if (!targetRune) return null;
    
    // Swap the two runes (no placement restrictions)
    newGrid[toRow][toCol] = runeId;
    newGrid[fromRow][fromCol] = targetRuneId;
    return newGrid;
  }

  // Move the rune to empty slot
  newGrid[toRow][toCol] = runeId;
  newGrid[fromRow][fromCol] = null;

  return newGrid;
}


export function createEmptyGrid(): (string | null)[][] {
  return [
    [null, null, null, null], // Row 0 - 4 slots (keystones)
    [null, null, null],       // Row 1 - 3 slots
    [null, null, null],       // Row 2 - 3 slots
    [null, null, null],       // Row 3 - 3 slots
  ];
}


export function canPlaceRuneInSlot(
  rune: Rune,
  row: number,
  col: number,
  currentGrid: (string | null)[][]
): boolean {
  // Check if slot exists
  if (row === 0 && col >= 4) return false;
  if (row > 0 && col >= 3) return false;
  
  // All placements are allowed
  return true;
}

export function findEmptySlots(grid: (string | null)[][]): { row: number; col: number }[] {
  const emptySlots: { row: number; col: number }[] = [];
  
  for (let row = 0; row < 4; row++) {
    const cols = row === 0 ? 4 : 3;
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === null) {
        emptySlots.push({ row, col });
      }
    }
  }
  
  return emptySlots;
}

export function getNextEmptySlot(grid: (string | null)[][]): { row: number; col: number } | null {
  const emptySlots = findEmptySlots(grid);
  return emptySlots[0] || null;
}