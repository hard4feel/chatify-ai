import { useState } from 'react';

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = () => {
    if (login === 'luvvu_admin' && pass === 'luvvu2025') {
      onSuccess();
    } else {
      alert('Неверный логин или пароль');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl w-96 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">luvvu</h1>
        <input
          type="text"
          placeholder="Логин"
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-xl"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-3 mb-6 bg-gray-700 text-white rounded-xl"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 py-3 rounded-xl text-white font-semibold"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
