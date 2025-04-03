
// src/components/documents/utils/categoryUtils.ts
import { SupabaseClient } from '@supabase/supabase-js';

// Define types for categories and access levels
type Category = {
  id: string;
  name: string;
  color?: string;
};

type AccessLevel = 'public' | 'private' | 'restricted';

// Sync categories to Supabase
export async function syncCategoriesToSupabase(
  supabase: SupabaseClient,
  categories: Category[]
): Promise<void> {
  const { error } = await supabase.from('categories').upsert(categories);
  if (error) throw new Error(`Failed to sync categories: ${error.message}`);
}

// Enhance categories with color information
export function getCategoriesWithColors(categories: Category[]): Category[] {
  const colorMap: Record<string, string> = {
    public: 'green',
    private: 'red',
    restricted: 'yellow',
  };
  return categories.map((cat) => ({
    ...cat,
    color: colorMap[cat.name.toLowerCase()] || 'gray',
  }));
}

// Fetch document categories (stub implementation)
export function getDocumentCategories(): Category[] {
  return [
    { id: '1', name: 'public' },
    { id: '2', name: 'private' },
    { id: '3', name: 'restricted' },
  ];
}

// Get folder icon color based on access level
export function getFolderIconColorByAccessLevel(accessLevel: AccessLevel): string {
  const colorMap: Record<AccessLevel, string> = {
    public: 'green',
    private: 'red',
    restricted: 'yellow',
  };
  return colorMap[accessLevel] || 'gray';
}

// Render access level badge (returns a simple string for simplicity)
export function renderAccessLevelBadge(accessLevel: AccessLevel): string {
  const badgeStyles: Record<AccessLevel, string> = {
    public: 'badge-public',
    private: 'badge-private',
    restricted: 'badge-restricted',
  };
  return badgeStyles[accessLevel] || 'badge-default';
}
