"use client"

import { useState } from 'react';
import PostsTab from '../../components/admin/PostsTab';
import CategoriesTab from '../../components/admin/CategoriesTab';
import AnalyticsTab from '../../components/admin/AnalyticsTab';
import EditPostTab from '../../components/admin/EditPostTab';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/admin/ErrorMessage';
import { useBlogData } from '@/hooks/useBlogData';
import { usePostOperations } from '@/hooks/usePostOperations';
import { useCategoryOperations } from '@/hooks/useCategoryOperations';
import { TabType, Post } from '@/lib/types/dashboard';

export default function BlogDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { posts, categories, isLoading, error, refetchPosts, refetchCategories } = useBlogData();
  
  const { handleSavePost, handleDeletePost } = usePostOperations({
    posts,
    setPosts: refetchPosts,
    setEditingPost,
    setActiveTab
  });
  
  const { handleAddCategory, handleDeleteCategory } = useCategoryOperations({
    categories,
    posts,
    refetchCategories
  });

  const handleEditPost = (post: Post) => {
    setEditingPost({ ...post });
    setActiveTab("edit");
  };

  const resetEditingState = () => {
    setEditingPost(null);
    setActiveTab("posts");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className=" max-w-full mx-auto p-8 min-h-screen ">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Administração de posts</h1>
        <nav className="border-b border-gray-200 mt-4">
          <div className="flex -mb-px justify-center">
            <TabButton
              active={activeTab === 'posts'}
              onClick={() => { setActiveTab('posts'); setEditingPost(null); }}
            >
              Posts
            </TabButton>
            <TabButton
              active={activeTab === 'category'}
              onClick={() => { setActiveTab('category'); setEditingPost(null); }}
            >
              Categorias
            </TabButton>
            <TabButton
              active={activeTab === 'analytics'}
              onClick={() => { setActiveTab('analytics'); setEditingPost(null); }}
            >
              Análise
            </TabButton>
          </div>
        </nav>
      </header>

      <main>
        {activeTab === "posts" && (
          <PostsTab
            posts={posts}
            categories={categories}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        )}

        {activeTab === "category" && (
          <CategoriesTab
            categories={categories}
            posts={posts}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab
            posts={posts}
            categories={categories}
          />
        )}

        {activeTab === "edit" && editingPost && (
          <EditPostTab
            editingPost={editingPost}
            setEditingPost={setEditingPost}
            categories={categories}
            onSave={handleSavePost}
            onCancel={resetEditingState}
          />
        )}
      </main>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      className={`mr-6 py-2 px-1 ${
        active
          ? 'border-b-2 border-blue-500 text-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}