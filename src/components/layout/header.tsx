"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, User, Plus, ArrowLeft } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
};

type Category = {
  id: string;
  categoryname: string;
  slug?: string;
};

function MenuDropdown({ buttonLabel, menuItems, icon }: {
  buttonLabel: string;
  menuItems: MenuItem[];
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (menuItems.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-gray-700 hover:text-orange-500 transition-colors py-2 px-2 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon}
        <span>{buttonLabel}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100 animate-fadeIn">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [categoryMenu, setCategoryMenu] = useState<MenuItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuth = true;
  const isAdmin = true;

  const profileMenu = [
    ...(isAdmin ? [{ label: "Administração", href: "/admin-panel" }] : []),
    { label: "Ver Perfil", href: "/profile" },
    { label: "Configurações", href: "/settings" },
    { label: "Sair", href: "/logout" },
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/blog-post/get-categories");
        const data = await res.json();

        const formatted = data.map((cat: Category) => ({
          label: cat.categoryname,
          href: `/blog/categories/${cat.slug || cat.id}`,
        }));

        setCategoryMenu(formatted);
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            AlgumNome
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <MenuDropdown
              buttonLabel="Categorias"
              menuItems={categoryMenu}
              icon={<Menu size={18} />}
            />
          </div>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-orange-50 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu de navegação"
        >
          <Menu size={24} className="text-gray-700" />
        </button>

        <div className="hidden md:flex items-center gap-4">
          {isAuth ? (
            <>
              <MenuDropdown
                buttonLabel="Meu perfil"
                menuItems={profileMenu}
                icon={<User size={18} />}
              />

              {pathname !== "/blog/new" ? (
                <button
                  onClick={() => router.push("/blog/new")}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <Plus size={18} />
                  <span>Novo Post</span>
                </button>
              ) : (
                <button
                  onClick={() => router.back()}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <ArrowLeft size={18} />
                  <span>Voltar</span>
                </button>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 animate-fadeIn">
          <div className="space-y-2">
            {categoryMenu.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-500 mb-2">Categorias</p>
                {categoryMenu.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="block py-2 text-gray-700 hover:text-orange-500"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 pt-2 mt-2">
              {isAuth ? (
                <>
                  {profileMenu.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className="block py-2 text-gray-700 hover:text-orange-500"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {pathname !== "/blog/new" ? (
                    <Link
                      href="/blog/new"
                      className="block py-2 text-orange-500 font-medium"
                    >
                      Novo Post
                    </Link>
                  ) : null}
                </>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 text-orange-500 font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}