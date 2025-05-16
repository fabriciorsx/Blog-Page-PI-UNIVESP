import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  description: string;
  image: string;
  userid: string;
  username: string;
  userimage: string;
  comments: string[];
  uploaddate: number;
  category: string;
};

async function getPostById(id: number): Promise<Post | null> {
  const postData = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
    },
  });

  if (!postData) {
    return null;
  }

  const post: Post = {
    id: postData.id,
    title: postData.title,
    description: postData.description,
    image: postData.image,
    userid: postData.userid,
    username: postData.username,
    userimage: postData.userimage,
    comments: postData.comments,
    uploaddate: postData.uploaddate.getTime(),
    category: postData.category?.categoryname || "Sem categoria",
  };

  return post;
}

async function getRelatedPosts(categoryName: string, currentPostId: number): Promise<Post[]> {
  const relatedPosts = await prisma.post.findMany({
    where: {
      category: {
        categoryname: categoryName,
      },
      id: {
        not: currentPostId,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      uploaddate: "desc",
    },
    take: 4,
  });

  return relatedPosts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    image: post.image,
    userid: post.userid,
    username: post.username,
    userimage: post.userimage,
    comments: post.comments,
    uploaddate: post.uploaddate.getTime(),
    category: post.category?.categoryname || "Sem categoria",
  }));
}

function truncateText(text: string, maxLength: number): string {
  const plainText = text.replace(/<[^>]*>/g, "");
  
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength) + "...";
}

type PageProps = {
  params: {
    id: string;
  };
};

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostById(parseInt(params.id));

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.id);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-96 object-cover rounded-lg mb-8"
      />
      <span className="text-sm text-gray-500">{post.category}</span>
      <h1 className="mt-2 text-4xl font-bold text-gray-800">{post.title}</h1>

      <div className="mt-4 text-gray-600 text-sm flex gap-4">
        <span>Por {post.username}</span>
        <span>{new Date(post.uploaddate).toLocaleDateString()}</span>
      </div>

      <article
        className="prose prose-lg mt-8 text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.description }}
      ></article>

      {relatedPosts.length > 0 && (
        <div className="mt-16 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Posts Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedPosts.map((relatedPost) => (
              <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id} className="block group">
                <div className="relative rounded-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="rounded-2xl w-18/20 h-18 m-1  mx-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-md">
                      <span className="text-xs font-medium text-gray-700">
                        {new Date(relatedPost.uploaddate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="shadow-sm line-clamp-1">
                    <h3 className="font-medium text-gray-800 line-clamp-2 mb-3 leading-none">{relatedPost.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {truncateText(relatedPost.description, 100)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}