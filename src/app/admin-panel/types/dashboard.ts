export interface Category {
  id: string;
  categoryname: string;
}

export interface Post {
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

export type TabType = "posts" | "category" | "analytics" | "edit";