import { Calendar, Edit, Trash2 } from 'lucide-react';
import DOMPurify from "isomorphic-dompurify";
import { Post, Category } from "@/lib/types/dashboard";

interface PostsTabProps {
  posts: Post[];
  categories: Category[];
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

export default function PostsTab({ posts, categories, onEditPost, onDeletePost }: PostsTabProps) {
  const getCategoryName = (post: Post): string => {
    if (post.category) {
      return post.category.categoryname;
    }
    const category = categories.find(cat => cat.id === post.categoryId);
    return category ? category.categoryname : 'Sem categoria';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
        <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Post
        </div>
        <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Data
        </div>
        <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Categoria
        </div>
        <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Ações
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {posts.length > 0 ? (
          posts.map(post => post.id && (
            <PostRow
              key={post.id}
              post={post}
              categoryName={getCategoryName(post)}
              onEdit={() => onEditPost(post)}
              onDelete={() => post.id && onDeletePost(post.id)}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            Nenhum post encontrado. Crie seu primeiro post com o botão &quot;Novo Post&quot;.
          </div>
        )}
      </div>
    </div>
  );
}

interface PostRowProps {
  post: Post;
  categoryName: string;
  onEdit: () => void;
  onDelete: () => void;
}

function PostRow({ post, categoryName, onEdit, onDelete }: PostRowProps) {
  return (
    <div className="grid grid-cols-4 hover:bg-gray-50">
      <div className="px-6 py-4">
        <div className="font-medium text-gray-900">{post.title}</div>
        <div className="text-sm text-gray-500 truncate max-w-xs">
          {DOMPurify.sanitize(post.description, { ALLOWED_TAGS: [] })}
        </div>
      </div>

      <div className="px-6 py-4 flex items-center text-sm text-gray-500">
        <Calendar size={14} className="mr-1" />
        {new Date(post.uploaddate).toLocaleDateString()}
      </div>

      <div className="px-6 py-4 flex items-center text-sm text-gray-500">
        {categoryName}
      </div>

      <div className="px-6 py-4 text-right justify-end space-x-2">
        <button
          className="text-blue-600 hover:text-blue-900 flex items-center"
          onClick={onEdit}
        >
          <Edit size={16} />
          <span className="ml-1">Editar</span>
        </button>
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