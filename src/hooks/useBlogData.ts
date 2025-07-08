import { useState, useEffect } from 'react';
import { Post, Category } from '../types/dashboard';

export function useBlogData() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  return {
    posts,
    categories,
    isLoading,
    error,
    refetchPosts: fetchPosts,
    refetchCategories: fetchCategories
  };
}
