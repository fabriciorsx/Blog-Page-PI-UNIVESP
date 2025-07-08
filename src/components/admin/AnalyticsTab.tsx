import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Post, Category } from '../../app/admin-panel/types/dashboard';

interface AnalyticsTabProps {
  posts: Post[];
  categories: Category[];
}

export default function AnalyticsTab({ posts, categories }: AnalyticsTabProps) {
  const chartData = categories.map(cat => ({
    name: cat.categoryname,
    posts: posts.filter(post => post.categoryId === cat.id).length
  }));

  const recentPosts = posts
    .sort((a, b) => new Date(b.uploaddate).getTime() - new Date(a.uploaddate).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Análise do Blog</h2>

      <StatsCards posts={posts} categories={categories} />
      <CategoryChart data={chartData} />
      <RecentActivity posts={recentPosts} />
    </div>
  );
}

interface StatsCardsProps {
  posts: Post[];
  categories: Category[];
}

function StatsCards({ posts, categories }: StatsCardsProps) {
  return (
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
  );
}

interface CategoryChartProps {
  data: Array<{ name: string; posts: number }>;
}

function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="mb-8">
      <h3 className="text-md font-medium mb-4">Posts por Categoria</h3>
      <div className="h-64 bg-gray-50 p-4 border border-gray-200 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="posts" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface RecentActivityProps {
  posts: Post[];
}

function RecentActivity({ posts }: RecentActivityProps) {
  return (
    <div>
      <h3 className="text-md font-medium mb-4">Atividade Recente</h3>
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
        {posts.map(post => post.id && (
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
  );
}