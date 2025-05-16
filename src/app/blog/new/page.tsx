"use client"
import TextEditor from "@/components/text-editor"
import React, { useEffect, useState } from "react"

interface PostData {
  id: string
  title: string
  description: string
  image: string
  categoryId: number
  userId: string
  userName: string
  userImage: string
  comments: string[]
  uploadDate: string
}

interface Category {
  id: number
  categoryname: string
}

const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [categoryId, setCategoryId] = useState<number | "">("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true;
    
    const fetchCategories = () => {
      setIsLoading(true);
      
      fetch("/api/blog-post/get-categories")
        .then(res => {
          if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (isMounted) {
            console.log("Categorias carregadas:", data);
            setCategories(data);
            setError(null);
          }
        })
        .catch(error => {
          if (isMounted) {
            console.error("Erro ao buscar categorias:", error);
            setError("Falha ao carregar categorias. Tente novamente mais tarde.");
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    };

    fetchCategories();
    
    return () => {
      isMounted = false;
    };
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (categoryId === "") {
      alert("Por favor, selecione uma categoria")
      return
    }

    const newPost: PostData = {
      id: crypto.randomUUID(),
      title,
      description,
      image,
      categoryId: Number(categoryId),
      userId: "123",
      userName: "Joao Silva",
      userImage: "/default-user.png",
      comments: [],
      uploadDate: new Date().toISOString(),
    }

    try {
      const res = await fetch("/api/blog-post/add-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })

      if (!res.ok) throw new Error("Erro ao criar post")

      const data = await res.json()
      console.log("Post criado com sucesso:", data)
      
      setTitle("")
      setDescription("")
      setImage("")
      setCategoryId("")
    } catch (error) {
      console.error(error)
      alert("Erro ao criar post")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Novo Post</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded bg-white"
          required
        />
        <TextEditor content={description} onChange={setDescription} />
        <input
          type="text"
          placeholder="URL da Imagem"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border p-2 rounded bg-white"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
          className="border p-2 rounded bg-white"
          required
          disabled={isLoading}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoryname}
            </option>
          ))}
        </select>
        
        {isLoading && <p className="text-gray-500">Carregando categorias...</p>}

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-400 text-white py-2 px-4 rounded text-sm"
          disabled={isLoading}
        >
          Publicar
        </button>
      </form>
    </div>
  )
}

export default CreatePost