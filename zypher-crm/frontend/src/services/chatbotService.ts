/**
 * Servicio para interactuar con el chatbot de ventas
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
  session_id?: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  recommended_plan?: string;
  conversation_history: ChatMessage[];
  metadata?: {
    model?: string;
    usage?: {
      total_tokens?: number;
    };
    fallback?: boolean;
  };
}

export interface PlanInfo {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_period: string;
  description: string;
  features: string[];
  limits: {
    documents: number;
    users: number;
    clients: number;
  };
  recommended_for?: string[];
}

export interface PlansListResponse {
  plans: PlanInfo[];
  total: number;
}

class ChatbotService {
  /**
   * Enviar mensaje al chatbot
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await axios.post<ChatResponse>(
      `${API_URL}/api/v1/chatbot/chat`,
      request
    );
    return response.data;
  }

  /**
   * Obtener lista de planes
   */
  async getPlans(): Promise<PlansListResponse> {
    const response = await axios.get<PlansListResponse>(
      `${API_URL}/api/v1/chatbot/plans`
    );
    return response.data;
  }

  /**
   * Obtener detalles de un plan específico
   */
  async getPlanDetails(planId: string): Promise<PlanInfo> {
    const response = await axios.get<PlanInfo>(
      `${API_URL}/api/v1/chatbot/plans/${planId}`
    );
    return response.data;
  }

  /**
   * Verificar estado del servicio
   */
  async checkHealth(): Promise<any> {
    const response = await axios.get(
      `${API_URL}/api/v1/chatbot/health`
    );
    return response.data;
  }
}

export default new ChatbotService();
