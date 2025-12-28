/**
 * Utility functions for string transformations
 * Used across product, category, and other modules
 */

/**
 * Generate uppercase code from Vietnamese text
 * Example: "Máy tính Gaming" -> "MAY-TINH-GAMING"
 */
export function generateCodeFromName(name: string): string {
  return name
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/Đ/g, 'D')
    .replace(/[^A-Z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

/**
 * Generate lowercase slug from Vietnamese text
 * Example: "Máy tính Gaming" -> "may-tinh-gaming"
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

/**
 * Generate random ID with 8 characters (a-z, 0-9)
 * Example: "a3x9k2m5"
 *
 * Xác suất trùng:
 * - 36^8 = 2,821,109,907,456 combinations (~2.8 trillion)
 * - Với 1 triệu categories → xác suất trùng: 0.00000035%
 */
export function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate hierarchical code with unique ID
 * Example:
 * - Root: generateHierarchicalCode("PC Gaming")
 *   → "PC-GAMING-a3x9k2m5"
 *
 * - Child: generateHierarchicalCode("RGB Series", "PC-GAMING-a3x9k2m5")
 *   → "PC-GAMING-a3x9k2m5-RGB-SERIES-b7y4n1p8"
 *
 * @param name - Tên category
 * @param parentCode - Code của parent (nếu có)
 * @returns Unique hierarchical code
 */
export function generateHierarchicalCode(name: string, parentCode?: string): string {
  const baseName = generateCodeFromName(name);
  const uniqueId = generateShortId();

  if (!parentCode) {
    // Root category: BASE-UUID
    return `${baseName}-${uniqueId}`;
  }

  // Child category: PARENT-BASE-UUID
  return `${parentCode}-${baseName}-${uniqueId}`;
}
