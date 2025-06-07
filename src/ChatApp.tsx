import { useState, useRef, FormEvent } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { SignOutButton } from "./SignOutButton";
import { UserList } from "./UserList";
import { CreateGroupModal } from "./CreateGroupModal";
import { VideoCallModal } from "./VideoCallModal";

export function ChatApp() {
  const [selectedChatId, setSelectedChatId] = useState<Id<"chats"> | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeVideoCall, setActiveVideoCall] = useState<{
    roomUrl: string;
    roomId: Id<"dailyRooms">;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useQuery(api.users.getCurrentUser);
  const chats = useQuery(api.chats.listUserChats) || [];
  const messages = useQuery(
    api.chats.getChatMessages,
    selectedChatId ? { chatId: selectedChatId } : "skip"
  ) || [];
  const activeRooms = useQuery(
    api.dailyRooms.getActiveDailyRooms,
    selectedChatId ? { chatId: selectedChatId } : "skip"
  ) || [];

  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const createDirectChat = useMutation(api.chats.createDirectChat);
  const createDailyRoom = useMutation(api.dailyRooms.createDailyRoom);
  const createDailyRoomWithAPI = useAction(api.dailyRooms.createDailyRoomWithAPI);
  const joinDailyRoom = useMutation(api.dailyRooms.joinDailyRoom);
  const createTestUsers = useMutation(api.users.createTestUsers);

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedChatId || (!messageText.trim() && !selectedImage)) return;

    try {
      if (selectedImage) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const { storageId } = await result.json();

        await sendMessage({
          chatId: selectedChatId,
          content: selectedImage.name,
          type: "image",
          imageId: storageId,
        });

        setSelectedImage(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
      } else {
        await sendMessage({
          chatId: selectedChatId,
          content: messageText,
          type: "text",
        });
      }

      setMessageText("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleUserSelect = async (userId: Id<"users">) => {
    try {
      const chatId = await createDirectChat({ participantId: userId });
      setSelectedChatId(chatId);
      setShowUserList(false);
    } catch (error) {
      console.error("Erro ao criar chat:", error);
    }
  };

  const startVideoCall = async () => {
    if (!selectedChatId || !selectedChat) return;

    try {
      const roomName = `${selectedChat.name.replace(/\s+/g, '-')}-video-${Date.now()}`;
      
      // Criar sala com API do Daily.co
      const apiResult = await createDailyRoomWithAPI({
        chatId: selectedChatId,
        roomName,
      });

      // Criar entrada no banco de dados
      const roomId = await createDailyRoom({
        chatId: selectedChatId,
        roomName,
        roomUrl: apiResult.roomUrl,
      });

      setActiveVideoCall({
        roomUrl: apiResult.roomUrl,
        roomId,
      });
    } catch (error) {
      console.error("Erro ao iniciar chamada de vídeo:", error);
    }
  };

  const startAudioCall = async () => {
    if (!selectedChatId || !selectedChat) return;

    try {
      const roomName = `${selectedChat.name.replace(/\s+/g, '-')}-audio-${Date.now()}`;
      
      const apiResult = await createDailyRoomWithAPI({
        chatId: selectedChatId,
        roomName,
      });

      const roomId = await createDailyRoom({
        chatId: selectedChatId,
        roomName,
        roomUrl: apiResult.roomUrl,
      });

      setActiveVideoCall({
        roomUrl: apiResult.roomUrl,
        roomId,
      });
    } catch (error) {
      console.error("Erro ao iniciar chamada de áudio:", error);
    }
  };

  const joinExistingCall = async (room: any) => {
    try {
      await joinDailyRoom({ roomId: room._id });
      setActiveVideoCall({
        roomUrl: room.dailyRoomUrl,
        roomId: room._id,
      });
    } catch (error) {
      console.error("Erro ao entrar na chamada:", error);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "agora";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Barra lateral */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Conversas</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowUserList(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Nova conversa"
              >
                <i className="fas fa-plus text-gray-400"></i>
              </button>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Criar grupo"
              >
                <i className="fas fa-users text-gray-400"></i>
              </button>
              <button
                onClick={async () => {
                  try {
                    const result = await createTestUsers();
                    console.log(result.message);
                  } catch (error) {
                    console.error("Erro ao criar usuários de teste:", error);
                  }
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Criar usuários de teste (Maicon e Giovana)"
              >
                <i className="fas fa-user-plus text-gray-400"></i>
              </button>
            </div>
          </div>
          <SignOutButton />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {chats.map((chat) => {
              const otherParticipant = chat.participants.find(
                (p) => p && p._id !== currentUser?._id
              );
              const displayName = chat.type === "group" 
                ? chat.name 
                : otherParticipant?.name || otherParticipant?.email || "Desconhecido";
              const avatar = chat.type === "group"
                ? chat.avatar || "https://images.unsplash.com/photo-1522075469751-3847ae2c3d8c?w=150&h=150&fit=crop&crop=face"
                : otherParticipant?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face";

              return (
                <div
                  key={chat._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChatId === chat._id
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedChatId(chat._id)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={avatar}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white truncate">
                          {displayName}
                        </h4>
                        {chat.lastMessageTime && (
                          <span className="text-xs text-gray-400">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {typeof chat.lastMessage === 'string' ? chat.lastMessage : "Sem mensagens"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    selectedChat.type === "group"
                      ? selectedChat.avatar || "https://images.unsplash.com/photo-1522075469751-3847ae2c3d8c?w=150&h=150&fit=crop&crop=face"
                      : selectedChat.participants.find(p => p && p._id !== currentUser?._id)?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                  }
                  alt="Chat"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">
                    {selectedChat.type === "group"
                      ? selectedChat.name
                      : selectedChat.participants.find(p => p && p._id !== currentUser?._id)?.name || "Desconhecido"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedChat.type === "group"
                      ? `${selectedChat.participants.length} membros`
                      : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={startAudioCall}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Chamada de áudio"
                >
                  <i className="fas fa-phone text-gray-400"></i>
                </button>
                <button 
                  onClick={startVideoCall}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Chamada de vídeo"
                >
                  <i className="fas fa-video text-gray-400"></i>
                </button>
              </div>
            </div>

            {activeRooms.length > 0 && (
              <div className="bg-green-600 p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-video text-white"></i>
                  <span className="text-white font-medium">
                    Chamada ativa • {activeRooms[0].participants.length} participante(s)
                  </span>
                </div>
                <button
                  onClick={() => joinExistingCall(activeRooms[0])}
                  className="bg-white text-green-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Entrar na chamada
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isMe = message.senderId === currentUser?._id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isMe
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {message.type === "image" && message.imageUrl ? (
                        <img
                          src={message.imageUrl}
                          alt="Imagem compartilhada"
                          className="max-w-full h-auto rounded-lg mb-2"
                        />
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className="text-xs mt-1 opacity-70">
                        {formatTime(message._creationTime)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Anexar imagem"
                >
                  <i className="fas fa-paperclip text-gray-400"></i>
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() && !selectedImage}
                  className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                  title="Enviar mensagem"
                >
                  <i className="fas fa-paper-plane text-white"></i>
                </button>
              </form>
              {selectedImage && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    Imagem selecionada: {selectedImage.name}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold mb-2">Selecione uma conversa</h2>
              <p>Escolha um amigo ou grupo para começar a conversar</p>
            </div>
          </div>
        )}
      </div>

      {showUserList && (
        <UserList
          onClose={() => setShowUserList(false)}
          onUserSelect={handleUserSelect}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={(chatId) => {
            setSelectedChatId(chatId);
            setShowCreateGroup(false);
          }}
        />
      )}

      {activeVideoCall && (
        <VideoCallModal
          roomUrl={activeVideoCall.roomUrl}
          roomId={activeVideoCall.roomId}
          onClose={() => setActiveVideoCall(null)}
        />
      )}
    </div>
  );
}
