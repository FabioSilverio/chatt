import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface UserListProps {
  onClose: () => void;
  onUserSelect: (userId: Id<"users">) => void;
}

export function UserList({ onClose, onUserSelect }: UserListProps) {
  const users = useQuery(api.users.getAllUsers) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Selecionar usuário</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => onUserSelect(user._id)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <img
                src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"}
                alt={user.name || "Usuário"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-white">
                  {user.name || "Usuário sem nome"}
                </h4>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            Nenhum usuário encontrado
          </p>
        )}
      </div>
    </div>
  );
}
