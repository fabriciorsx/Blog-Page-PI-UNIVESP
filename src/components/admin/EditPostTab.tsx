import { Save } from 'lucide-react';
import TextEditor from "@/components/text-editor";
import { Post, Category } from '../../app/admin-panel/types/dashboard';

interface EditPostTabProps {
  editingPost: Post;
  setEditingPost: (post: Post) => void;
  categories: Category[];
  onSave: (post: Post) => Promise<void>;
  onCancel: () => void;
}

export default function EditPostTab({ 
  editingPost, 
  setEditingPost, 
  categories, 
  onSave, 
  onCancel 
}: EditPostTabProps) {
  const handleSave = async () => {
    try {
      await onSave(editingPost);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PostForm
        post={editingPost}
        setPost={setEditingPost}
        categories={categories}
      />
      
      <ActionButtons
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
}

interface PostFormProps {
  post: Post;
  setPost: (post: Post) => void;
  categories: Category[];
}

function PostForm({ post, setPost, categories }: PostFormProps) {
  return (
    <>
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          type="text"
          id="title"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <TextEditor
          content={post.description}
          onChange={(content) => setPost({ ...post, description: content })}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          URL da Imagem
        </label>
        <input
          type="text"
          id="image"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={post.image}
          onChange={(e) => setPost({ ...post, image: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        <select
          id="category"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={post.categoryId}
          onChange={(e) => {
            const selectedCategoryId = e.target.value;
            const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
            setPost({
              ...post,
              categoryId: selectedCategoryId,
              category: selectedCategory
            });
          }}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.categoryname}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Data de Publicação
        </label>
        <input
          type="date"
          id="date"
          className="p-2 border border-gray-300 rounded-md"
          value={post.uploaddate ? new Date(post.uploaddate).toISOString().split('T')[0] : ''}
          onChange={(e) => setPost({ ...post, uploaddate: e.target.value })}
        />
      </div>
    </>
  );
}

interface ActionButtonsProps {
  onSave: () => Promise<void>;
  onCancel: () => void;
}

function ActionButtons({ onSave, onCancel }: ActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-3">
      <button
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        onClick={onCancel}
      >
        Cancelar
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        onClick={onSave}
      >
        <Save size={16} className="mr-1" />
        Salvar Alterações
      </button>
    </div>
  );
}