import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, User, Search, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { messages, users, fetchMessages, fetchUsers, sendMessage, markMessageAsRead, loading } = useDataStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        await Promise.all([
          fetchUsers(),
          fetchMessages()
        ]);
      }
    };
    
    loadData();
  }, [user, fetchUsers, fetchMessages]);
  
  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedUserId, messages]);
  
  // Get all users that the current user has exchanged messages with
  const getConversationUsers = () => {
    if (!user) return [];
    
    const userIds = new Set<string>();
    
    messages.forEach(message => {
      if (message.senderId === user.id) {
        userIds.add(message.receiverId);
      } else if (message.receiverId === user.id) {
        userIds.add(message.senderId);
      }
    });
    
    return Array.from(userIds)
      .map(id => users.find(u => u.id === id))
      .filter(Boolean);
  };
  
  // Filter conversation users by search query
  const filteredConversationUsers = getConversationUsers().filter(user => {
    if (!searchQuery) return true;
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Get messages for the selected conversation
  const getConversationMessages = () => {
    if (!user || !selectedUserId) return [];
    
    return messages
      .filter(message => 
        (message.senderId === user.id && message.receiverId === selectedUserId) ||
        (message.receiverId === user.id && message.senderId === selectedUserId)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };
  
  const conversationMessages = getConversationMessages();
  
  // Mark unread messages as read when viewing the conversation
  useEffect(() => {
    if (user && selectedUserId) {
      const unreadMessages = conversationMessages.filter(
        message => message.receiverId === user.id && !message.read
      );
      
      unreadMessages.forEach(message => {
        markMessageAsRead(message.id);
      });
    }
  }, [user, selectedUserId, conversationMessages, markMessageAsRead]);
  
  const handleSendMessage = async () => {
    if (!user || !selectedUserId || !messageText.trim()) return;
    
    try {
      await sendMessage({
        senderId: user.id,
        receiverId: selectedUserId,
        content: messageText,
      });
      
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: Record<string, any[]> = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };
  
  const groupedMessages = groupMessagesByDate(conversationMessages);
  
  if (loading.messages || loading.users) {
    return <LoadingSpinner message="Loading messages..." />;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]">
          {/* Conversations list */}
          <div className="border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" />
                Messages
              </h2>
              
              <div className="mt-3 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100vh-300px)]">
              {filteredConversationUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p>No conversations yet.</p>
                  <p className="text-sm mt-1">
                    Start by connecting with other developers.
                  </p>
                  <button
                    onClick={() => navigate('/search')}
                    className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    Find Developers
                  </button>
                </div>
              ) : (
                filteredConversationUsers.map(user => {
                  if (!user) return null;
                  
                  // Check for unread messages from this user
                  const unreadCount = messages.filter(
                    m => m.senderId === user.id && m.receiverId === user?.id && !m.read
                  ).length;
                  
                  // Get the last message in the conversation
                  const lastMessage = messages
                    .filter(m => 
                      (m.senderId === user.id && m.receiverId === user?.id) ||
                      (m.receiverId === user.id && m.senderId === user?.id)
                    )
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                  
                  return (
                    <div
                      key={user.id}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                        selectedUserId === user.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            </div>
                          )}
                          {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary-600 dark:bg-primary-400 ring-2 ring-white dark:ring-gray-800"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            {lastMessage && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(lastMessage.createdAt), 'h:mm a')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                              {lastMessage?.content || 'No messages yet'}
                            </p>
                            {unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Conversation area */}
          <div className="col-span-2 flex flex-col h-full">
            {selectedUserId ? (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="flex-shrink-0">
                    {users.find(u => u.id === selectedUserId)?.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={users.find(u => u.id === selectedUserId)?.avatar}
                        alt={users.find(u => u.id === selectedUserId)?.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {users.find(u => u.id === selectedUserId)?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {users.find(u => u.id === selectedUserId)?.email}
                    </p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {conversationMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p>No messages yet.</p>
                        <p className="text-sm mt-1">
                          Start the conversation with a message.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {groupedMessages.map(group => (
                        <div key={group.date} className="space-y-4">
                          <div className="relative flex items-center">
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                            <span className="mx-4 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(group.date), 'MMMM d, yyyy')}
                            </span>
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                          </div>
                          
                          {group.messages.map(message => {
                            const isCurrentUser = message.senderId === user?.id;
                            
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                              >
                                {!isCurrentUser && (
                                  <div className="flex-shrink-0 mr-2 mt-1">
                                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                                      <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                    </div>
                                  </div>
                                )}
                                
                                <div
                                  className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                                    isCurrentUser
                                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                                    {format(new Date(message.createdAt), 'h:mm a')}
                                  </p>
                                </div>
                                
                                {isCurrentUser && (
                                  <div className="flex-shrink-0 ml-2 mt-1">
                                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                                      <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <textarea
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      className="flex-1 resize-none focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Press Shift+Enter for a new line. Enter to send.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>Select a conversation to view messages.</p>
                  <p className="text-sm mt-1">Or start a new conversation from the search page.</p>
                  <button
                    onClick={() => navigate('/search')}
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    Find Teammates
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;