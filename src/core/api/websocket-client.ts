import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';

/**
 * Cliente WebSocket singleton genérico, basado en STOMP con fallback a SockJS.
 * Utilizado para la conexión bidireccional en tiempo real con el backend Spring Boot.
 */
class WebSocketClient {
  private client: Client;

  constructor() {
    // Tomamos la URL del servidor backend. 
    // Por defecto asume que si corre en local o con vite está en la 8080 (o la de env)
    const backendUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:8080';

    this.client = new Client({
      // Se utiliza SockJS como fábrica para conectarse al /ws endpoint configurado en Spring.
      webSocketFactory: () => new SockJS(`${backendUrl}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Si en el futuro protegen los temas web sockets, acá se pasan los Headers STOMP (Ej. el Token JWT)
      connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      debug: (str) => {
        // Opcional: imprimir los debugs para desarrollo
        if (import.meta.env.DEV) {
          console.debug('[STOMP]', str);
        }
      },
    });

    // Activar conexión de forma asincrónica.
    this.client.activate();
  }

  /**
   * Suscripción genérica a un canal/tema específico.
   * 
   * @param topic El canal (ej., "/topic/comandas")
   * @param callback Función de retorno tipada genéricamente que ejecutará la información recibida.
   * @returns Un objeto de suscripción STOMP que permite hacer unsubscribe() al desmontar el componente.
   */
  public subscribe<T>(topic: string, callback: (data: T) => void): StompSubscription | null {
    // Si el cliente no está conectado en el exacto instante, programamos la subscripción para después.
    // Lo ideal en React es conectarlo y manejar el estado async o suscribirse onSuccess.
    // El onConnect del cliente no debe ser sobreescrito cada vez. STOMP encoli-rá la suscripción automáticamente
    // gracias a su protocolo de reconnects o subscripciones pendientes si se realiza a través de su API nativa.
    
    // Fallback: asegurarse de que se conecte
    if (!this.client.connected) {
       this.client.onConnect = () => {
         return this.emitSubscription<T>(topic, callback);
       }
    }
    
    return this.emitSubscription<T>(topic, callback);
  }

  private emitSubscription<T>(topic: string, callback: (data: T) => void): StompSubscription | null {
    if (!this.client.connected) return null; // Será encolado/ejecutado por onConnect() arribeñ

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
