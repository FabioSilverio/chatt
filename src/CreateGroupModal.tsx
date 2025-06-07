import { useState, FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface CreateGroupModalProps {
  onClose: () => void;
  onGroupCreated: (chatId: Id<"chats">) => void;
}

export function CreateGroupModal({ onClose, onGroupCreated }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);

  const users = useQuery(api.users.getAllUsers) || [];
  const createGroupChat = useMutation(api.chats.createGroupChat);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;

    try {
      const chatId = await createGroupChat({
        name: groupName,
        participantIds: selectedUsers,
      });
      onGroupCreated(chatId);
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  const toggleUser = (userId: Id<"users">) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Criar grupo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do grupo
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Digite o nome do grupo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selecionar membros ({selectedUsers.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user._id)
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"}
                    alt={user.name || "Usuário"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">
                      {user.name || "Usuário sem nome"}
                    </h4>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  {selectedUsers.includes(user._id) && (
                    <i className="fas fa-check text-white"></i>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!groupName.trim() || selectedUsers.length === 0}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Criar grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
