import { Post, TabType } from '@/lib/types/dashboard';

interface UsePostOperationsProps {
  posts: Post[];
  setPosts: () => void;
  setEditingPost: (post: Post | null) => void;
  setActiveTab: (tab: TabType) => void;
}

export function usePostOperations({ 
  setPosts, 
  setEditingPost, 
  setActiveTab 
}: UsePostOperationsProps) {

  const handleSavePost = async (editingPost: Post) => {
    if (!editingPost) return;

    try {
      const updatedPost = { ...editingPost };

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

      setEditingPost(null);
      setActiveTab('posts');
      setPosts();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
  try {
    const response = await fetch(`/api/blog-post/delete-post`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: postId }),
    });

    if (!response.ok) {
      throw new Error('Falha ao deletar post');
    }

    setPosts();
  } catch (error) {
    console.error('Erro ao deletar post:', error);
  }
};
  return {
    handleSavePost,
    handleDeletePost,
  };
}