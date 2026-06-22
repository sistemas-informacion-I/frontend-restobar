import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';

interface PendingSubscription {
  id: string;
  topic: string;
  callback: (data: any) => void;
  realSubscription?: StompSubscription;
}

/**
 * Cliente WebSocket singleton genérico, basado en STOMP con fallback a SockJS.
 * Utilizado para la conexión bidireccional en tiempo real con el backend Spring Boot.
 */
class WebSocketClient {
  private client: Client;
  private pendingSubscriptions: Map<string, PendingSubscription> = new Map();
  private subscriptionIdCounter = 0;

  constructor() {
    // Tomamos la URL del servidor backend. 
    const backendUrl = import.meta.env.VITE_API_URL 
      ?? 'http://localhost:3000';

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Se obtienen los headers de forma dinámica justo antes de conectar (útil para reconexiones tras login)
      beforeConnect: () => {
        this.client.connectHeaders = {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        };
      },
      onConnect: () => {
        if (import.meta.env.DEV) {
          console.debug('[STOMP] Conectado exitosamente');
        }
        this.processPendingSubscriptions();
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.debug('[STOMP]', str);
        }
      },
    });

    this.client.activate();
  }

  private processPendingSubscriptions() {
    this.pendingSubscriptions.forEach((sub) => {
      if (!sub.realSubscription) {
        sub.realSubscription = this.emitSubscription(sub.topic, sub.callback);
      }
    });
  }

  /**
   * Suscripción genérica a un canal/tema específico.
   * Maneja internamente el estado de conexión para encolar subscripciones
   * si el cliente aún no está conectado.
   * 
   * @param topic El canal (ej., "/topic/sucursal/1/comandas")
   * @param callback Función de retorno tipada genéricamente
   * @returns Un objeto con el método unsubscribe()
   */
  public subscribe<T>(topic: string, callback: (data: T) => void): { unsubscribe: () => void } {
    const id = `sub_${this.subscriptionIdCounter++}`;
    
    const pendingSub: PendingSubscription = {
      id,
      topic,
      callback,
    };
    
    this.pendingSubscriptions.set(id, pendingSub);

    if (this.client.connected) {
      pendingSub.realSubscription = this.emitSubscription<T>(topic, callback);
    }

    return {
      unsubscribe: () => {
        const sub = this.pendingSubscriptions.get(id);
        if (sub?.realSubscription) {
          sub.realSubscription.unsubscribe();
        }
        this.pendingSubscriptions.delete(id);
      }
    };
  }

  private emitSubscription<T>(topic: string, callback: (data: T) => void): StompSubscription {
    return this.client.subscribe(topic, (message) => {
      try {
        const body: T = JSON.parse(message.body);
        callback(body);
      } catch (err) {
        console.error('Error parseando JSON de WebSocket para topico: ' + topic, err);
      }
    });
  }
}

// Exportamos una única instancia estable (Singleton) del cliente para usarse en todo la app.
export const wsClient = new WebSocketClient();
