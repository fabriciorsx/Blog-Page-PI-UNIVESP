import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Category, Post } from '../../app/admin-panel/types/dashboard';

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
    <div className="bg-white rounded-lg shadow p-6">
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
      <form onSubmit={onSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Nome da categoria"
          className="p-2 border border-gray-300 rounded-md mr-2 flex-grow"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          disabled={!newCategoryName.trim()}
        >
          <Plus size={16} className="mr-1" />
          Adicionar Categoria
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
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Gerenciar Categorias</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
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
              Nenhuma categoria encontrada. Crie sua primeira categoria usando o formulário acima.
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
    <div className="grid grid-cols-3 hover:bg-gray-50">
      <div className="px-6 py-4">
        <div className="font-medium text-gray-900">{category.categoryname}</div>
      </div>

      <div className="px-6 py-4 text-sm text-gray-500">
        {postCount} posts
      </div>

      <div className="px-6 py-4 flex space-x-2">
        <button
          className="text-red-600 hover:text-red-900 flex items-center"
          onClick={onDelete}
        >
          <Trash2 size={16} />
          <span className="ml-1">Excluir</span>
        </button>
      </div>
    </div>
  );
}