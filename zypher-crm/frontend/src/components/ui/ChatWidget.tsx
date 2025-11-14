/**
 * Widget de chatbot conversacional con IA para ventas
 */
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import chatbotService, { ChatMessage } from '../../services/chatbotService';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedPlan, setRecommendedPlan] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '¡Hola! 👋 Soy el asistente de Zypher. ¿Te ayudo a encontrar el plan perfecto para tu negocio?'
      }]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Agregar mensaje del usuario
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage({
        message: userMessage,
        conversation_history: messages
      });

      if (response.success) {
        // Agregar respuesta del bot
        setMessages([
          ...newMessages,
          { role: 'assistant', content: response.message }
        ]);

        // Actualizar plan recomendado si existe
        if (response.recommended_plan) {
          setRecommendedPlan(response.recommended_plan);
        }
      } else {
        // Mensaje de error
        setMessages([
          ...newMessages,
          { role: 'assistant', content: '❌ Disculpa, tuve un problema. ¿Puedes intentar de nuevo?' }
        ]);
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '❌ Error de conexión. Por favor intenta nuevamente.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([{
      role: 'assistant',
      content: '¡Hola! 👋 Soy el asistente de Zypher. ¿Te ayudo a encontrar el plan perfecto para tu negocio?'
    }]);
    setRecommendedPlan(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full animate-pulse"></span>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ¿Necesitas ayuda? Chatea con nosotros
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="font-semibold">Asistente Zypher</h3>
            <p className="text-xs text-blue-100">En línea • Respuesta inmediata</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Cerrar chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <p className="text-sm text-gray-500">Escribiendo...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Plan recomendado badge */}
      {recommendedPlan && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
          <p className="text-xs text-blue-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Plan recomendado: <span className="font-semibold capitalize">{recommendedPlan}</span>
          </p>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Quick actions */}
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleResetChat}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Reiniciar chat
          </button>
        </div>
      </div>
    </div>
  );
}
