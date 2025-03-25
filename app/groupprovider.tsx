import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Key,
  useEffect
} from "react";

type Member = {
  userId: string;
  userName: string;
  avatar: string;
};

type Message = {
  messageId: string;
  senderId: string;
  content: string;
  timestamp: Date;
};

type Group = {
  groupId: string;
  groupName: string;
  groupDesc: string;
  groupAvatar: string;
  isJoined: boolean;
  members: Member[];
  messages: Message[];
};
interface EventItem {
  title: string;
  details: string;
  goal_id: string;
  task_id: string;
}

interface EventsByDate {
  [date: string]: EventItem[];
}
type Flag = {
  flag: boolean;
};

type GroupContextType = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  filteredGroups: Group[];
  setFilteredGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  updateGroup: (groupId: string, groupName: string, groupDesc: string) => void;
  leaveGroup: (groupId: string) => void;
  sendMessage: (groupId: string, content: string, userId: string) => void;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  user: string; // 新增user状态
  setUser: React.Dispatch<React.SetStateAction<string>>;
  slogan: string;
  setSlogan: React.Dispatch<React.SetStateAction<string>>; // 新增修改user的方法
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  goal_id: string;
  setGoalId: React.Dispatch<React.SetStateAction<string>>;
  task_id: string;
  setTaskId: React.Dispatch<React.SetStateAction<string>>;
  eventsByDate: EventsByDate;
  setEventsByDate: React.Dispatch<React.SetStateAction<EventsByDate>>;
  flag: boolean;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
  flag1: boolean;
  setFlag1: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  ws: WebSocket | null;
  createWebSocket: (token: string) => void;
};

const GroupContext = createContext<GroupContextType>({} as GroupContextType);

interface GroupProviderProps {
  children: ReactNode;
}
const initialEvents: EventsByDate = {};
export const GroupProvider: React.FC<GroupProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);

  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<string>(""); // 初始化user状态
  const [slogan, setSlogan] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [goal_id, setGoalId] = useState<string>("");
  const [task_id, setTaskId] = useState<string>("");
  const [eventsByDate, setEventsByDate] = useState<EventsByDate>(initialEvents);
  const [flag, setFlag] = useState(false);
  const [flag1, setFlag1] = useState<boolean>(false);

  const [token, setToken]=useState<string>("")
  const [ws,setWs]=useState<WebSocket | null>(null)
  const createWebSocket = (token: string) => {
 
    if(ws){
      ws.close()
    }
    const socket = new WebSocket(`ws://8.129.3.142:8080/chat/ws?token=${token}`);
    socket.onopen = () => {
      console.log("WebSocket 连接已打开");
    };
    socket.onmessage = (event) => {
      console.log("WebSocket 收到消息:",event.data)
  };
  socket.onerror = (error) => {
    console.error("WebSocket 发生错误:", error);
  };
  socket.onclose = () => {
    console.log("WebSocket 连接已关闭");
  };

setWs(socket)
}
useEffect(()=>{
 if(isLogin){
  createWebSocket(token)
 }
 else{
 return () => {
  if(ws)ws.close
  }}
},[isLogin,token,flag1])
  const updateGroup = (
    groupId: string,
    groupName: string,
    groupDesc: string
  ) => {
    const updatedGroups = groups.map((group) =>
      group.groupId === groupId
        ? { ...group, groupName, groupDesc, isJoined: true }
        : group
    );
    setGroups(updatedGroups);
    setFilteredGroups(updatedGroups);
  };

  const leaveGroup = (groupId: string) => {
    const updatedGroups = groups.map((group) =>
      group.groupId === groupId ? { ...group, isJoined: false } : group
    );
    setGroups(updatedGroups);
    setFilteredGroups(updatedGroups);
  };

  const sendMessage = (groupId: string, content: string, senderId: string) => {
    const newMessage = {
      messageId: Date.now().toString(),
      senderId,
      content,
      timestamp: new Date(),
    };

    const updatedGroups = groups.map((group) => {
      if (group.groupId === groupId) {
        return {
          ...group,
          messages: [...group.messages, newMessage],
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    setFilteredGroups(updatedGroups);
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        setGroups,
        filteredGroups,
        setFilteredGroups,
        updateGroup,
        leaveGroup,
        sendMessage,
        isLogin,
        setIsLogin,
        userId,
        setUserId,
        user, // 暴露user状态
        setUser,
        setSlogan,
        slogan,
        email,
        setEmail,
        goal_id,
        setGoalId,
        task_id,
        setTaskId,
        eventsByDate,
        setEventsByDate,
        flag,
        setFlag,
        token,
        setToken,
        ws,
        createWebSocket,
        flag1,
        setFlag1,
      
      
        // 暴露修改user的方法
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => useContext(GroupContext);
