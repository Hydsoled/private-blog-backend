import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  handleConnection(client: any, ...args: any[]): any {
    console.log('connected');
  }

  handleDisconnect(client: any): any {
    console.log('disconnected');
  }

  @SubscribeMessage('message')
  handleEvent(client: any, data: any): WsResponse<any> {
    const event = 'events';
    console.log(data);
    return { event, data };
  }

  afterInit(server: any): any {
    console.log('webchat init');
  }
}
