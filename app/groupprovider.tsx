import React, { createContext, useState, useContext, ReactNode } from 'react';

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
  slogan:string;
  setSlogan: React.Dispatch<React.SetStateAction<string>>;// 新增修改user的方法
};

const GroupContext = createContext<GroupContextType>({} as GroupContextType);

interface GroupProviderProps {
  children: ReactNode;
}

export const GroupProvider: React.FC<GroupProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([
    {
      groupId: '1',
      groupName: '小组一',
      groupDesc: '这是小组一的简介。',
      groupAvatar: 'https://example.com/avatar1.png',
      isJoined: true,
      members: [
        {
          userId: 'user1',
          userName: '当前用户',
          avatar: 'https://example.com/user1-avatar.png',
        },
        {
          userId: 'user2',
          userName: '其他用户',
          avatar: 'https://example.com/user2-avatar.png',
        },
      ],
      messages: [
        {
          messageId: 'm1',
          senderId: 'user1',
          content: '大家好！',
          timestamp: new Date(2024, 5, 15, 10, 30),
        },
        {
          messageId: 'm2',
          senderId: 'user2',
          content: '大家好！',
          timestamp: new Date(2024, 5, 15, 10, 30),
        },
        {
          messageId: 'm3',
          senderId: 'user2',
          content: '大家！',
          timestamp: new Date(2024, 5, 15, 10, 30),
        },
      ],
    },
  ]);

  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<string>(''); // 初始化user状态
  const [slogan,setSlogan]=useState<string>('');

  const updateGroup = (groupId: string, groupName: string, groupDesc: string) => {
    const updatedGroups = groups.map(group =>
      group.groupId === groupId
        ? { ...group, groupName, groupDesc, isJoined: true }
        : group
    );
    setGroups(updatedGroups);
    setFilteredGroups(updatedGroups);
  };

  const leaveGroup = (groupId: string) => {
    const updatedGroups = groups.map(group =>
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

    const updatedGroups = groups.map(group => {
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
        user,     // 暴露user状态
        setUser, 
      setSlogan,
      slogan
 // 暴露修改user的方法
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => useContext(GroupContext);
