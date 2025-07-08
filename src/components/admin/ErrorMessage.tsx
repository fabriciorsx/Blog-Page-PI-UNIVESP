interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 p-4 rounded-lg text-red-700">
        <h2 className="text-lg font-bold">Erro ao carregar posts</h2>
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