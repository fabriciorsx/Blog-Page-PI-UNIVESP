"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

type Post = {
  id: number;
  title: string;
  description: string;
  image: string;
  username: string;
  uploaddate: Date;
  categoryId: number;
  category?: {
    id: number;
    categoryname: string;
  };
};

type Category = {
  id: number;
  categoryname: string;
};

async function getPosts(): Promise<Post[]> {
  const response = await fetch("/api/blog-post/get-all-posts");

  if (!response.ok) {
    throw new Error("Erro ao buscar os posts");
  }

  const posts: Post[] = await response.json();
  return posts;
}

async function getCategories(): Promise<Category[]> {
  const response = await fetch("/api/blog-post/get-categories");

  if (!response.ok) {
    throw new Error("Erro ao buscar as categorias");
  }

  const categories: Category[] = await response.json();
  return categories;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPosts(),
          getCategories()
        ]);

        setCategories(categoriesData);

        const postsWithCategories = postsData.map(post => {
          const category = categoriesData.find(cat => cat.id === post.categoryId);
          return {
            ...post,
            category: category
          };
        });

        setPosts(postsWithCategories);
      } catch (error) {
        console.error(error);
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function getCategoryName(post: Post): string {
    if (post.category) {
      return post.category.categoryname;
    }
    const category = categories.find(cat => cat.id === post.categoryId);
    return category ? category.categoryname : "Sem categoria";
  }

  if (loading) {
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
          <h2 className="text-lg font-bold">Erro ao carregar os posts</h2>
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

  if (posts.length === 0) {
    return <p className="text-center text-gray-500 mt-10">Nenhum post ainda.</p>;
  }

  return (
    <div className="max-w-full mx-auto p-4 min-h-screen">

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10">Últimos Posts</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {posts.map((post) => (
    <Link key={post.id} href={`/blog/${post.id}`}>
      <div className="bg-white rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 overflow-hidden cursor-pointer flex flex-col h-[400px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-md">
              {getCategoryName(post)}
            </span>
            <h2 className="mt-2 text-2xl font-semibold text-gray-800 line-clamp-2">
              {post.title}
            </h2>
            <p className="mt-2 text-gray-600 text-sm line-clamp-3">
              {DOMPurify.sanitize(post.description, {
                ALLOWED_TAGS: [],
              })}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Por {post.username}</span>
            <span>{new Date(post.uploaddate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>
      </main>
    </div>
  );
}