import { MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { chatApi } from '../services/chatApi';
import { createSocket } from '../services/socket';

const formatTime = (date) => new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
}).format(new Date(date));

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const { token, user } = useAuth();
  const { pushToast } = useToast();
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const requestIdFromUrl = searchParams.get('requestId');
  const providerIdFromUrl = searchParams.get('providerId');

  useEffect(() => {
    if (!token) return undefined;

    const nextSocket = createSocket(token);
    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    async function loadChats() {
      setLoading(true);

      try {
        const { data } = await chatApi.getChats();
        setChats(data.chats || []);

        if (requestIdFromUrl) {
          const result = await chatApi.getByRequest(requestIdFromUrl, providerIdFromUrl);
          setActiveChat(result.data.chat);
          setMessages(result.data.chat.messages || []);
        } else if (data.chats?.length) {
          const firstChat = data.chats[0];
          const result = await chatApi.getById(firstChat._id);
          setActiveChat(result.data.chat);
          setMessages(result.data.chat.messages || []);
        }
      } catch (error) {
        pushToast(error.response?.data?.message || 'Unable to load chat.');
      } finally {
        setLoading(false);
      }
    }

    loadChats();
  }, [providerIdFromUrl, pushToast, requestIdFromUrl]);

  useEffect(() => {
    if (!socket || !activeChat) return undefined;

    socket.emit('joinRoom', { chatId: activeChat._id }, (response) => {
      if (!response?.success) {
        pushToast(response?.message || 'Unable to join chat room.');
      }
    });

    const handleReceiveMessage = ({ chatId, message }) => {
      if (chatId?.toString() !== activeChat._id?.toString()) return;

      setMessages((items) => (
        items.some((item) => item._id === message._id) ? items : [...items, message]
      ));
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [activeChat, pushToast, socket]);

  async function selectChat(chat) {
    setActiveChat(chat);

    try {
      const { data } = await chatApi.getById(chat._id);
      setActiveChat(data.chat);
      setMessages(data.chat.messages || []);
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to open chat.');
    }
  }

  function sendMessage(event) {
    event.preventDefault();
    if (!socket || !activeChat || !messageText.trim()) return;

    setSending(true);
    socket.emit('sendMessage', {
      chatId: activeChat._id,
      message: messageText,
    }, (response) => {
      setSending(false);

      if (!response?.success) {
        pushToast(response?.message || 'Unable to send message.');
        return;
      }

      setMessageText('');
    });
  }

  const otherPerson = activeChat?.participants?.find((participant) => participant._id !== user?.id);

  return (
    <DashboardLayout title="Chat" subtitle="Message clients and providers in real time after an application.">
      <div className="grid gap-4 xl:min-h-[680px] xl:grid-cols-[340px_1fr] xl:gap-6">
        <Card className="h-fit xl:sticky xl:top-24">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">Conversations</h2>
              <p className="mt-1 text-sm text-slate-500">Chats linked to requests.</p>
            </div>
            <MessageCircle className="h-5 w-5 text-blue-500" />
          </div>

          {loading ? (
            <Loader label="Loading chats" />
          ) : chats.length === 0 && !activeChat ? (
            <EmptyState title="No chats yet" description="A chat becomes available after an application is created." />
          ) : (
            <div className="space-y-3">
              {[activeChat, ...chats.filter((chat) => chat._id !== activeChat?._id)].filter(Boolean).map((chat) => (
                <button
                  key={chat._id}
                  type="button"
                  onClick={() => selectChat(chat)}
                  className={`w-full rounded-lg border p-4 text-left transition ${activeChat?._id === chat._id ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white hover:bg-blue-50'}`}
                >
                  <p className="font-bold text-slate-950">{chat.requestId?.title || 'Request chat'}</p>
                  <p className="mt-1 text-sm text-slate-500">{chat.providerId?.name || 'Provider conversation'}</p>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex min-h-[calc(100vh-11rem)] flex-col overflow-hidden p-0 hover:shadow-soft xl:min-h-[680px]">
          {!activeChat ? (
            <div className="grid flex-1 place-items-center p-6">
              <EmptyState title="Select a conversation" description="Choose a request chat to start messaging." />
            </div>
          ) : (
            <>
              <div className="border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
                <p className="font-display text-xl font-bold text-slate-950">{activeChat.requestId?.title}</p>
                <p className="mt-1 text-sm text-slate-500">Chatting with {otherPerson?.name || activeChat.providerId?.name || 'participant'}</p>
              </div>

              <div className="flex-1 space-y-4 overflow-auto bg-slate-50/70 px-4 py-5 sm:px-6">
                {messages.length === 0 ? (
                  <EmptyState title="No messages yet" description="Send the first message to begin the conversation." />
                ) : messages.map((message) => {
                  const senderId = message.senderId?._id || message.senderId;
                  const isMine = senderId === user?.id;

                  return (
                    <div key={message._id || `${senderId}-${message.createdAt}`} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[86%] rounded-lg px-4 py-3 shadow-soft sm:max-w-[72%] ${isMine ? 'bg-primary text-white' : 'bg-white text-slate-700'}`}>
                        <p className="text-sm leading-6">{message.text}</p>
                        <p className={`mt-2 text-[11px] ${isMine ? 'text-blue-100' : 'text-slate-400'}`}>{formatTime(message.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="flex gap-3 border-t border-slate-100 bg-white p-4 sm:p-5">
                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
                  placeholder="Type your message..."
                />
                <Button type="submit" disabled={sending || !messageText.trim()} className="px-4 disabled:cursor-not-allowed disabled:opacity-60" aria-label="Send message">
                  <Send className="h-4 w-4" /> <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
