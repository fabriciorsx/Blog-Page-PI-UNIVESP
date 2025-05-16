"use client"

import { useState, useEffect } from 'react';
import { Calendar, Edit, Save, Trash2, Plus } from 'lucide-react';
import TextEditor from "@/components/text-editor"
import DOMPurify from "isomorphic-dompurify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Category {
  id: string;
  categoryname: string;
}

interface Post {
  id?: string;
  title: string;
  description: string;
  uploaddate: string;
  categoryId: string;
  category?: Category;
  image: string;
  userId: string;
  userName: string;
  userImage: string;
}

export default function BlogDashboard() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"posts" | "category" | "analytics" | "edit">("posts");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const [newCategoryName, setNewCategoryName] = useState<string>('');
 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/blog-post/get-all-posts');
        if (!response.ok) {
          throw new Error('Falha ao buscar posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ocorreu';
        setError(errorMessage);
        console.error('Erro ao buscar posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog-post/get-categories');
        if (!response.ok) {
          throw new Error('Falha ao buscar categorias');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    fetchPosts();
    fetchCategories();
  }, []);

  const handleEditPost = (post: Post) => {
    setEditingPost({
      ...post
    });
    setActiveTab("edit");
  };


  const handleSavePost = async () => {
    if (!editingPost) return;
    
    try {
      const updatedPost = {
        ...editingPost
      };
      
      const response = await fetch(`/api/blog-post/update-post`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar post');
      }
      
      const savedPost: Post = await response.json();
      
      if (savedPost.id) {
        setPosts(posts.map(p => p.id === savedPost.id ? savedPost : p));
        setEditingPost(null);
        setActiveTab("posts");
      }
    } catch (err) {
      console.error('Erro ao salvar post:', err instanceof Error ? err.message : 'Erro desconhecido');
      alert('Falha ao salvar post. Por favor, tente novamente.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    try {
      const response = await fetch(`/api/blog-post/delete-post`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir post');
      }
      
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Erro ao excluir post:', err instanceof Error ? err.message : 'Erro desconhecido');
      alert('Falha ao excluir post. Por favor, tente novamente.');
    }
  };

 

  const getCategoryName = (post: Post): string => {
    if (post.category) {
      return post.category.categoryname;
    }
    
    const category = categories.find(cat => cat.id === post.categoryId);
    return category ? category.categoryname : 'Sem categoria';
  };
  
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const response = await fetch('/api/blog-post/add-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryname: newCategoryName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Falha ao adicionar categoria');
      }

      const newCategory: Category = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err instanceof Error ? err.message : 'Erro desconhecido');
      alert('Falha ao adicionar categoria. Por favor, tente novamente.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const postsUsingCategory = posts.filter(post => post.categoryId === categoryId);

    if (postsUsingCategory.length > 0) {
      alert('Esta categoria não pode ser removida pois está sendo usada por um ou mais posts.');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const response = await fetch('/api/blog-post/delete-category', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: categoryId }),
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir a categoria');
      }

      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (err) {
      console.error('Erro ao excluir categoria:', err instanceof Error ? err.message : 'Erro desconhecido');
      alert('Falha ao excluir a categoria. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          <h2 className="text-lg font-bold">Erro ao carregar posts</h2>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Administração de posts</h1>
        <div className="border-b border-gray-200 mt-4">
          <nav className="flex -mb-px">
            <button 
              className={`mr-6 py-2 px-1 ${activeTab === 'posts' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {setActiveTab('posts'); setEditingPost(null);}}
            >
              Posts
            </button>
            <button 
              className={`mr-6 py-2 px-1 ${activeTab === 'category' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {setActiveTab('category'); setEditingPost(null);}}
            >
              Categorias
            </button>
            <button 
              className={`mr-6 py-2 px-1 ${activeTab === 'analytics' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {setActiveTab('analytics'); setEditingPost(null);}}
            >
              <div className="flex items-center">
                <div className="mr-1" />
                Análise
              </div>
            </button>
          </nav>
        </div>
      </header>

      <main>
        {activeTab === "posts" && (
          <>
            <div className="mb-4 flex justify-end">
              
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
                <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</div>
                <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</div>
                <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</div>
                <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {posts.length > 0 ? (
                  posts.map(post => post.id && (
                    <div key={post.id} className="grid grid-cols-4 hover:bg-gray-50">
                      <div className="px-6 py-4">
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{DOMPurify.sanitize(post.description, {
                      ALLOWED_TAGS: [],
                    })}</div>
                      </div>
                      
                      <div className="px-6 py-4 flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {new Date(post.uploaddate).toLocaleDateString()}
                      </div>
                      
                      <div className="px-6 py-4 flex items-center text-sm text-gray-500">
                        {getCategoryName(post)}
                      </div>
                      
                      <div className="px-6 py-4 text-right justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit size={16} />
                          <span className="ml-1">Editar</span>
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 flex items-center"
                          onClick={() => post.id && handleDeletePost(post.id)}
                        >
                          <Trash2 size={16} />
                          <span className="ml-1">Excluir</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Nenhum post encontrado. Crie seu primeiro post com o botão &quot;Novo Post&quot;.
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "category" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Adicionar Nova Categoria</h2>
              <form onSubmit={handleAddCategory} className="flex items-center">
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
                      <div key={category.id} className="grid grid-cols-3 hover:bg-gray-50">
                        <div className="px-6 py-4">
                          <div className="font-medium text-gray-900">{category.categoryname}</div>
                        </div>
                        
                        <div className="px-6 py-4 text-sm text-gray-500">
                          {posts.filter(post => post.categoryId === category.id).length} posts
                        </div>
                        
                        <div className="px-6 py-4 flex space-x-2">
                          <button 
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 size={16} />
                            <span className="ml-1">Excluir</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      Nenhuma categoria encontrada. Crie sua primeira categoria usando o formulário acima.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "analytics" && (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-6">Análise do Blog</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Total de Posts</h3>
        <p className="text-3xl font-bold text-blue-600">{posts.length}</p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <h3 className="text-lg font-medium text-purple-800 mb-2">Categorias</h3>
        <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
      </div>
    </div>

    <div className="mb-8">
      <h3 className="text-md font-medium mb-4">Posts por Categoria</h3>
      <div className="h-64 bg-gray-50 p-4 border border-gray-200 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categories.map(cat => ({
            name: cat.categoryname,
            posts: posts.filter(post => post.categoryId === cat.id).length
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="posts" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div>
      <h3 className="text-md font-medium mb-4">Atividade Recente</h3>
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
        {posts
          .sort((a, b) => new Date(b.uploaddate).getTime() - new Date(a.uploaddate).getTime())
          .slice(0, 5)
          .map(post => post.id && (
            <div key={post.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <span className="font-medium">{post.title}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(post.uploaddate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
)}


        {activeTab === "edit" && editingPost && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPost.title}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              
            </div>
            <TextEditor 
              content={editingPost.description} 
              onChange={(content) => setEditingPost({...editingPost, description: content})} 
            />
            
            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="text"
                id="image"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPost.image}
                onChange={(e) => setEditingPost({...editingPost, image: e.target.value})}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                id="category"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingPost.categoryId}
                onChange={(e) => {
                  const selectedCategoryId = e.target.value;
                  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
                  setEditingPost({
                    ...editingPost, 
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
                value={editingPost.uploaddate ? new Date(editingPost.uploaddate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditingPost({...editingPost, uploaddate: e.target.value})}
              />
            </div>
          
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setEditingPost(null);
                  setActiveTab("posts");
                }}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                onClick={handleSavePost}
              >
                <Save size={16} className="mr-1" />
                Salvar Alterações
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}