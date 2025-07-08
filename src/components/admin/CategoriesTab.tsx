import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Category, Post } from '@/lib/types/dashboard';

interface CategoriesTabProps {
  categories: Category[];
  posts: Post[];
  onAddCategory: (categoryName: string) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

export default function CategoriesTab({
  categories,
  posts,
  onAddCategory,
  onDeleteCategory
}: CategoriesTabProps) {
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    await onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 max-w-4xl mx-auto">
      <AddCategoryForm
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        onSubmit={handleAddCategory}
      />

      <CategoryList
        categories={categories}
        posts={posts}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
}

interface AddCategoryFormProps {
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function AddCategoryForm({ newCategoryName, setNewCategoryName, onSubmit }: AddCategoryFormProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Adicionar Nova Categoria</h2>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          placeholder="Nome da categoria"
          className="p-2 border border-gray-300 rounded-md flex-grow"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors disabled:bg-gray-400"
          disabled={!newCategoryName.trim()}
        >
          <Plus size={16} className="mr-2" />
          Adicionar
        </button>
      </form>
    </div>
  );
}

interface CategoryListProps {
  categories: Category[];
  posts: Post[];
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

function CategoryList({ categories, posts, onDeleteCategory }: CategoryListProps) {
  const getPostCount = (categoryId: string) => {
    return posts.filter(post => post.categoryId === categoryId).length;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Gerenciar Categorias</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="hidden md:grid md:grid-cols-3 bg-gray-50 border-b border-gray-200">
          <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nome da Categoria
          </div>
          <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantidade de Posts
          </div>
          <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {categories.length > 0 ? (
            categories.map(category => (
              <CategoryRow
                key={category.id}
                category={category}
                postCount={getPostCount(category.id)}
                onDelete={() => onDeleteCategory(category.id)}
              />
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              Nenhuma categoria encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CategoryRowProps {
  category: Category;
  postCount: number;
  onDelete: () => void;
}

function CategoryRow({ category, postCount, onDelete }: CategoryRowProps) {
  return (
    <div className="p-4 flex justify-between items-center md:grid md:grid-cols-3 md:gap-4 hover:bg-gray-50 transition-colors">
      <div>
        <div className="font-medium text-gray-900">{category.categoryname}</div>
        <div className="text-sm text-gray-500 md:hidden">{postCount} posts</div>
      </div>

      <div className="hidden md:block text-sm text-gray-500">
        {postCount} posts
      </div>

      <div className="flex justify-end">
        <button
          className="text-red-600 hover:text-red-900 flex items-center"
          onClick={onDelete}
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline ml-1">Excluir</span>
        </button>
      </div>
    </div>
  );
}