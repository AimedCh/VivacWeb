import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Smile, Paperclip, Search, Users, MessageCircle } from 'lucide-react';

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Mock data
  const chats = [
    { 
      id: 1, 
      name: 'Grupo Montañeros España', 
      avatar: '🏔️', 
      lastMessage: 'Alguien para ruta este sábado?',
      time: '10:30',
      unread: 3,
      online: true,
      type: 'group'
    },
    { 
      id: 2, 
      name: 'María González', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4a2?w=100',
      lastMessage: 'Gracias por los consejos!',
      time: '09:15',
      unread: 0,
      online: true,
      type: 'direct'
    },
    { 
      id: 3, 
      name: 'Carlos Ruiz', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      lastMessage: 'Te envío las fotos',
      time: 'Ayer',
      unread: 1,
      online: false,
      type: 'direct'
    },
    { 
      id: 4, 
      name: 'Vivac Responsable', 
      avatar: '⛺', 
      lastMessage: 'Nueva guía publicada',
      time: 'Ayer',
      unread: 0,
      online: true,
      type: 'group'
    },
  ];

  const mockMessages = [
    { id: 1, sender: 'María González', text: 'Hola! ¿Cómo estás?', time: '10:00', isMe: false, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4a2?w=100' },
    { id: 2, sender: 'Tú', text: 'Muy bien! Preparando la ruta del sábado', time: '10:02', isMe: true },
    { id: 3, sender: 'María González', text: '¿A dónde vas?', time: '10:03', isMe: false, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4a2?w=100' },
    { id: 4, sender: 'Tú', text: 'Pensaba ir a Sierra de Gredos', time: '10:05', isMe: true },
    { id: 5, sender: 'María González', text: '¡Genial! Yo también quiero ir. ¿Puedo unirme?', time: '10:06', isMe: false, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4a2?w=100' },
    { id: 6, sender: 'Tú', text: 'Claro! Cuantos más mejor 😊', time: '10:08', isMe: true },
  ];

  useEffect(() => {
    if (activeChat) {
      setMessages(mockMessages);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'Tú',
        text: newMessage,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-green-600" />
            Mensajes
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeChat?.id === chat.id ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {chat.type === 'group' ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-2xl">
                      {chat.avatar}
                    </div>
                  ) : (
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                  )}
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {activeChat.type === 'group' ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xl">
                    {activeChat.avatar}
                  </div>
                ) : (
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <h3 className="font-bold text-gray-800">{activeChat.name}</h3>
                  <p className="text-sm text-gray-600">
                    {activeChat.online ? (
                      <span className="text-green-600">● En línea</span>
                    ) : (
                      <span className="text-gray-500">Desconectado</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-green-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end space-x-2 ${message.isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {!message.isMe && message.avatar && (
                  <img src={message.avatar} alt={message.sender} className="w-8 h-8 rounded-full object-cover" />
                )}
                <div className={`flex flex-col ${message.isMe ? 'items-end' : 'items-start'}`}>
                  {!message.isMe && (
                    <span className="text-xs text-gray-600 mb-1 ml-2">{message.sender}</span>
                  )}
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      message.isMe
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 mx-2">{message.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50">
          <div className="text-center">
            <MessageCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Selecciona una conversación</h3>
            <p className="text-gray-600">Elige un chat de la lista para empezar a conversar</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

