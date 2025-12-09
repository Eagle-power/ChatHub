export interface User {
  id  : string,
  username : string,
  socketId: string,
  deviceId: string
  
}

export interface LoginProps{
    onLogin : (username : string ) => void
    onShowTerms: () => void;
}

export interface  ChatProps {
  currentUser : User | null,
  onLogout :  (username : string) => void
  initialMessages?: Message[]; // Add optional prop
  initialUsers?: User[];       // Add optional prop
}

export interface Message {
  id : string , 
  message : string , 
  user : User, 
  timestamp : Date,
  deviceId: string;
}

export interface HeaderProps { 
  currentUser : User | null,
  users : User[],
  onLogout  : (username : string) => void
}

export interface NotificationProps {
  type : "join" | "leave" | "message",
  text : string
}

export interface SidebarProps { 
  users : User[],
  currentUser : User
}

export interface MessageCompProps {
  user: User;
  message: string;
  timestamp: Date;
  isOwnMessage: boolean;  
}