export interface User {
  id: string;         
  username: string;
  socketId: string;
  deviceId: string;   
}

export interface Message {
  user: User;
  message: string;
  timestamp: Date;
  deviceId: string;   
}