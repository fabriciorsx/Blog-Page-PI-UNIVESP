import { Category, Post } from '../types/dashboard';

interface UseCategoryOperationsProps {
  categories: Category[];
  posts: Post[];
  refetchCategories: () => void;
}

export function useCategoryOperations({ categories, posts, refetchCategories }: UseCategoryOperationsProps) {

  const handleAddCategory = async (categoryName: string) => {
    if (!categoryName || categoryName.trim() === '') {
      alert('O nome da categoria não pode estar vazio.');
      return;
    }

    if (categories.some(category => category.categoryname.toLowerCase() === categoryName.toLowerCase())) {
      alert('Essa categoria já existe.');
      return;
    }

    try {
      const response = await fetch('/api/blog-post/add-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryname: categoryName }),
      });

      if (!response.ok) {
        throw new Error('Falha ao adicionar a categoria.');
      }
      refetchCategories();
      
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      alert('Ocorreu um erro ao adicionar a categoria.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const isCategoryInUse = posts.some(post => post.categoryId === categoryId);
    if (isCategoryInUse) {
      alert('Não é possível deletar uma categoria que está sendo usada em um ou mais posts.');
      return;
    }

    if (!confirm('Tem certeza de que deseja deletar esta categoria?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog-post/delete-category/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: categoryId}),
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar a categoria.');
      }

      refetchCategories();

    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      alert('Ocorreu um erro ao deletar a categoria.');
    }
  };

  return {
    handleAddCategory,
    handleDeleteCategory,
  };
}