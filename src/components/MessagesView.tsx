import React, { useState } from 'react';
import { 
  Search, Paperclip, Image as ImageIcon, Smile, Send, Phone, 
  MapPin, FileText, AlertCircle, ShieldAlert, CheckCheck, HelpCircle, ExternalLink 
} from 'lucide-react';
import { Conversation, ActiveTab } from '../types';
import { sendFirestoreMessage } from '../services/firebase';

interface MessagesViewProps {
  conversations: Conversation[];
  onOpenPdfModal: () => void;
  onOpenTripDetails: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenDispute: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations: initialConversations,
  onOpenPdfModal,
  onOpenTripDetails,
  onNavigateTab,
  onOpenDispute,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string>(initialConversations[0]?.id || 'conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Unread' | 'Agencies' | 'Support'>('All');
  const [messageInput, setMessageInput] = useState('');
  const [phoneCallNotification, setPhoneCallNotification] = useState(false);

  const currentConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Filtering conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterType === 'Unread') return c.isUnread;
    if (filterType === 'Agencies') return c.type === 'agency';
    if (filterType === 'Support') return c.type === 'support';
    return true;
  });

  const unreadCount = conversations.filter((c) => c.isUnread).length;

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || messageInput).trim();
    if (!content) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      senderName: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      timestamp: 'Today',
      text: content,
      isRead: false,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversation.id) {
          return {
            ...conv,
            isUnread: false,
            lastMessage: `“${content}”`,
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    // Persist real-time to Google Cloud Firestore
    sendFirestoreMessage({
      id: newMessage.id,
      conversationId: currentConversation.id,
      senderId: 'usr-renter',
      senderName: 'You',
      text: content,
      sentAt: new Date().toISOString(),
      isRead: false,
    });

    setMessageInput('');

    // Simulate friendly agency automated confirmation after 1.5 seconds if sending to Mayache Cars
    if (currentConversation.id === 'conv-1') {
      setTimeout(() => {
        const agencyReply = {
          id: `msg-reply-${Date.now()}`,
          sender: 'agency' as const,
          senderName: 'Mayache Cars',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          timestamp: 'Today',
          text: 'Noted with thanks Camille! We will have the vehicle washed, inspected, and ready at Terminal 1 arrivals.',
        };
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === 'conv-1') {
              return {
                ...conv,
                lastMessage: `“${agencyReply.text}”`,
                lastMessageTime: 'Just now',
                messages: [...conv.messages, agencyReply],
              };
            }
            return conv;
          })
        );
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
      
      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Conversations List (col-span-3 or 4) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm flex flex-col h-[750px]">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3">
            <h2 className="font-serif-display text-2xl font-bold text-neutral-900">
              Messages
            </h2>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold text-[#f95721]">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Search bar */}
          <div className="relative my-2">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F2EB] border border-transparent rounded-full pl-9 pr-4 py-2 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-300 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none">
            {(['All', 'Unread', 'Agencies', 'Support'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  filterType === filter
                    ? 'bg-[#181311] text-white'
                    : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Conversation list items */}
          <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-1">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#FAF8F5] border-neutral-300 shadow-xs'
                      : 'border-transparent hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${conv.avatarColor}`}>
                      {conv.avatarLetter}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-[13px] font-bold text-neutral-900 truncate">
                          {conv.agencyName}
                        </span>
                        <span className="text-[10px] text-neutral-400 shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>

                      {conv.bookingTag && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#f95721] bg-[#f95721]/10 px-2 py-0.5 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f95721]" />
                            <span>{conv.bookingTag}</span>
                          </span>
                          {conv.isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#f95721]" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer retention note */}
          <div className="pt-3 mt-2 border-t border-neutral-100 text-[11px] text-neutral-400 leading-tight">
            Messages stay open for 6 years alongside your agreement.
          </div>

        </div>

        {/* Center Column: Active Conversation Thread (col-span-5 or 6) */}
        <div className="lg:col-span-8 xl:col-span-6 bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm flex flex-col h-[750px]">
          
          {/* Thread Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${currentConversation.avatarColor}`}>
                {currentConversation.avatarLetter}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                  {currentConversation.agencyName} · {currentConversation.city}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {currentConversation.responseSpeed}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPhoneCallNotification(true);
                  setTimeout(() => setPhoneCallNotification(false), 3000);
                }}
                className="border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3 text-neutral-400" />
                <span>Call agency</span>
              </button>
              <button
                onClick={onOpenTripDetails}
                className="border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all"
              >
                Trip details
              </button>
            </div>
          </div>

          {phoneCallNotification && (
            <div className="bg-amber-50 text-amber-900 border border-amber-200 text-xs px-3 py-2 rounded-xl mt-2 flex items-center justify-between animate-fade-in">
              <span>Agency line: <strong>+212 5 28 84 12 34</strong> (Agency manager: Youssef Mayache)</span>
              <button onClick={() => setPhoneCallNotification(false)} className="text-amber-700 font-bold ml-2">✕</button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            <div className="text-center text-[11px] text-neutral-400 font-medium my-1">
              Tuesday, 26 August
            </div>

            {currentConversation.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl p-4 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#181311] text-white rounded-br-xs'
                        : 'bg-[#F5F2EB] text-neutral-900 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Attachments if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((att, idx) => (
                          <div key={idx}>
                            {att.type === 'pdf' ? (
                              <button
                                onClick={onOpenPdfModal}
                                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-300 text-left transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-[#f95721] flex items-center justify-center font-bold text-[10px]">
                                  PDF
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-neutral-900 truncate">
                                    {att.title}
                                  </div>
                                  <div className="text-[10px] text-neutral-400">
                                    {att.details}
                                  </div>
                                </div>
                              </button>
                            ) : (
                              <div className="rounded-xl overflow-hidden border border-neutral-200 bg-white p-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#f95721] shrink-0" />
                                <div className="text-xs font-medium text-neutral-800">
                                  {att.title} · {att.details}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Subtext info */}
                  <div className="text-[10px] text-neutral-400 mt-1 px-1 flex items-center gap-1">
                    <span>{isUser ? 'You' : msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.time}</span>
                    {isUser && msg.isRead && (
                      <>
                        <span>·</span>
                        <span className="text-neutral-500">Read</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSendMessage('Can we adjust the pick-up time to 11:30 AM?')}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-medium bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              Change pick-up time
            </button>
            <button
              onClick={() => handleSendMessage('I would like to add a second driver to our agreement.')}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-medium bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              Add second driver
            </button>
            <button
              onClick={() => handleSendMessage('What type of fuel does the vehicle require and what is the return policy?')}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-medium bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              Ask about fuel
            </button>
          </div>

          {/* Message Input Box */}
          <div className="mt-2 bg-[#F5F2EB] rounded-2xl p-3 border border-neutral-200/80">
            <textarea
              rows={2}
              placeholder={`Write to ${currentConversation.agencyName}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full bg-transparent resize-none text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 mt-1">
              <div className="flex items-center gap-2 text-neutral-400">
                <button 
                  onClick={() => alert('File upload: select PDF or image')}
                  className="p-1 hover:text-neutral-700 transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => alert('Attach photo of vehicle or licence')}
                  className="p-1 hover:text-neutral-700 transition-colors"
                  title="Add photo"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setMessageInput((prev) => prev + ' 👍')}
                  className="p-1 hover:text-neutral-700 transition-colors"
                  title="Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={!messageInput.trim()}
                className="bg-[#f95721] hover:bg-[#e04816] disabled:opacity-40 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Context & Safety Sidebar (col-span-12 xl:col-span-3) */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-4">
          
          {/* Card: THIS CONVERSATION IS ABOUT */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
              THIS CONVERSATION IS ABOUT
            </div>

            {/* Car Photo in Agadir Riad */}
            <div className="w-full h-36 rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={currentConversation.vehicleDetails.image}
                alt={currentConversation.vehicleDetails.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-3">
              <h3 className="text-base font-bold text-neutral-900">
                {currentConversation.vehicleDetails.name}
              </h3>
              <div className="text-xs text-neutral-500 mt-0.5">
                {currentConversation.vehicleDetails.agency} · {currentConversation.vehicleDetails.city} · {currentConversation.vehicleDetails.transmission}
              </div>

              <div className="mt-4 space-y-2 text-xs border-t border-neutral-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Pick-up</span>
                  <span className="font-semibold text-neutral-800">{currentConversation.vehicleDetails.pickup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Return</span>
                  <span className="font-semibold text-neutral-800">{currentConversation.vehicleDetails.returnDate}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-100">
                  <span className="text-neutral-500 font-medium">{currentConversation.vehicleDetails.totalDays} days total</span>
                  <span className="font-bold text-neutral-900">{currentConversation.vehicleDetails.totalAmount}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenTripDetails}
                  className="bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-semibold py-2 rounded-full transition-all text-center"
                >
                  Trip details
                </button>
                <button
                  onClick={onOpenPdfModal}
                  className="border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold py-2 rounded-full transition-all text-center"
                >
                  {currentConversation.vehicleDetails.contractId} PDF
                </button>
              </div>
            </div>
          </div>

          {/* Card: SHARED IN THIS THREAD */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
              SHARED IN THIS THREAD
            </div>

            <div className="space-y-2.5">
              {currentConversation.sharedFiles.map((file, idx) => (
                <div
                  key={idx}
                  onClick={onOpenPdfModal}
                  className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {file.type === 'pdf' ? (
                      <span className="text-[10px] font-bold text-[#f95721] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                        PDF
                      </span>
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
                    )}
                    <span className="text-neutral-800 font-medium truncate">
                      {file.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    {file.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: SAFE TO KNOW */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
              SAFE TO KNOW
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Keep it in the app. Everything you agree here is stored with the agreement and visible if a dispute is opened.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={onOpenDispute}
                className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-semibold py-2 rounded-full transition-all text-center"
              >
                Report a problem
              </button>
              <button
                onClick={() => onNavigateTab('messages')}
                className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-semibold py-2 rounded-full transition-all text-center"
              >
                Get Airbcar help
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
