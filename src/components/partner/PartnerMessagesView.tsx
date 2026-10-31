import React, { useState } from 'react';
import { 
  Paperclip, 
  Image as ImageIcon, 
  Check, 
  Send, 
  CheckCheck,
  AlertTriangle,
  Flag,
  ExternalLink
} from 'lucide-react';
import { PartnerConversation, PartnerBooking, SavedReply } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerMessagesViewProps {
  conversations: PartnerConversation[];
  activeBooking?: PartnerBooking;
  savedReplies: SavedReply[];
  onOpenContractPdf: (contractId?: string) => void;
  onConfirmDelivery: (bookingId: string) => void;
  onEscalateDispute: () => void;
}

export const PartnerMessagesView: React.FC<PartnerMessagesViewProps> = ({
  conversations: initialConvs,
  savedReplies,
  onOpenContractPdf,
  onConfirmDelivery,
  onEscalateDispute,
}) => {
  const { isLight, formatPrice, t } = useAccountSettings();
  const [conversations, setConversations] = useState<PartnerConversation[]>(initialConvs);
  const [selectedConvId, setSelectedConvId] = useState<string>(initialConvs[0]?.id || 'conv-camille');
  const [filterCategory, setFilterCategory] = useState<'needs_you' | 'upcoming' | 'on_trip' | 'closed'>('needs_you');
  const [replyText, setReplyText] = useState('');
  const [translateToFr, setTranslateToFr] = useState(false);
  const [deliveryConfirmedState, setDeliveryConfirmedState] = useState(false);

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const unansweredCount = conversations.filter(c => c.unreadCount > 0).length;

  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'partner' as const,
      senderName: 'Youssef',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: 'Today',
      text: replyText.trim(),
      isRead: true,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConv.id) {
        return {
          ...conv,
          unreadCount: 0,
          lastMessage: `"${replyText.trim()}"`,
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMsg],
        };
      }
      return conv;
    }));

    setReplyText('');
  };

  const handleApplySavedReply = (reply: SavedReply) => {
    setReplyText(reply.content);
  };

  const handleMarkClosed = () => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConv.id) {
        return { ...conv, category: 'closed', unreadCount: 0 };
      }
      return conv;
    }));
  };

  const filteredConversations = conversations.filter(c => {
    if (filterCategory === 'needs_you') return c.category === 'needs_you' || c.unreadCount > 0;
    if (filterCategory === 'upcoming') return c.category === 'upcoming';
    if (filterCategory === 'on_trip') return c.category === 'on_trip';
    if (filterCategory === 'closed') return c.category === 'closed';
    return true;
  });

  return (
    <div className={`w-full h-[calc(100vh-100px)] min-h-[720px] p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      
      {/* COLUMN 1: Conversations List (3.5 cols on desktop) */}
      <div className={`lg:col-span-3 xl:col-span-3 rounded-3xl border flex flex-col overflow-hidden shadow-xs transition-colors ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
      }`}>
        {/* Conversations Header */}
        <div className={`p-4 pb-3 border-b flex items-center justify-between ${
          isLight ? 'border-neutral-100' : 'border-[#261d16]'
        }`}>
          <div className="flex items-center gap-2">
            <h3 className={`font-serif-display text-base font-bold tracking-tight ${
              isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
            }`}>
              {t('messages', 'Conversations')}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#f95721] bg-[#f95721]/15 px-2.5 py-0.5 rounded-full border border-[#f95721]/30">
            {unansweredCount} unanswered
          </span>
        </div>

        {/* Filter Pills matching screenshot: [Needs you] [Upcoming] [On trip] [Closed] */}
        <div className={`px-3 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto border-b scrollbar-none ${
          isLight ? 'border-neutral-100' : 'border-[#261d16]'
        }`}>
          <button
            type="button"
            onClick={() => setFilterCategory('needs_you')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === 'needs_you'
                ? 'bg-[#f95721] text-white shadow-xs'
                : isLight
                ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
                : 'text-[#9c8e82] hover:text-white bg-[#221914]'
            }`}
          >
            Needs you
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('upcoming')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === 'upcoming'
                ? 'bg-[#f95721] text-white shadow-xs'
                : isLight
                ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
                : 'text-[#9c8e82] hover:text-white bg-[#221914]'
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('on_trip')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === 'on_trip'
                ? 'bg-[#f95721] text-white shadow-xs'
                : isLight
                ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
                : 'text-[#9c8e82] hover:text-white bg-[#221914]'
            }`}
          >
            On trip
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('closed')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === 'closed'
                ? 'bg-[#f95721] text-white shadow-xs'
                : isLight
                ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
                : 'text-[#9c8e82] hover:text-white bg-[#221914]'
            }`}
          >
            Closed
          </button>
        </div>

        {/* Conversations Scrollable List */}
        <div className={`flex-1 overflow-y-auto divide-y p-2 space-y-1 ${
          isLight ? 'divide-neutral-100' : 'divide-[#261d16]'
        }`}>
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedConv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all duration-150 relative ${
                  isSelected 
                    ? isLight 
                      ? 'bg-orange-50 border border-orange-200 shadow-xs' 
                      : 'bg-[#261d16] border border-[#3b2d22] shadow-xs' 
                    : isLight
                    ? 'hover:bg-neutral-50 border border-transparent'
                    : 'hover:bg-[#201813] border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Initials Avatar */}
                    <div className={`w-8 h-8 rounded-full ${conv.avatarColor || (isLight ? 'bg-orange-100 text-[#f95721]' : 'bg-[#2d221b] text-[#f5efe8]')} font-bold text-xs flex items-center justify-center shrink-0 border ${isLight ? 'border-orange-200' : 'border-white/10'}`}>
                      {conv.avatarInitials}
                    </div>
                    <div className="truncate">
                      <h4 className={`text-xs font-bold truncate ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                        {conv.renterName}
                      </h4>
                    </div>
                  </div>
                  <span className={`text-[10px] shrink-0 font-medium ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>
                    {conv.lastMessageTime}
                  </span>
                </div>

                {/* Message Snippet */}
                <p className={`text-xs mt-1.5 truncate font-normal ${isLight ? 'text-neutral-600' : 'text-[#a89b90]'}`}>
                  {conv.lastMessage}
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {conv.tag && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f95721]/15 text-[#f95721] border border-[#f95721]/30">
                      {conv.tag}
                    </span>
                  )}
                  {conv.pickupTag && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                      isLight 
                        ? 'bg-neutral-100 text-neutral-600 border-neutral-200' 
                        : 'bg-[#251c16] text-[#b5a79b] border-[#33261e]'
                    }`}>
                      {conv.pickupTag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN 2: Chat Thread (5.5 cols on desktop) */}
      <div className={`lg:col-span-6 xl:col-span-6 rounded-3xl border flex flex-col justify-between overflow-hidden shadow-xs transition-colors ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
      }`}>
        
        {/* Chat Header matching screenshot */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
          isLight ? 'border-neutral-100 bg-neutral-50/50' : 'border-[#261d16]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${selectedConv.avatarColor || (isLight ? 'bg-orange-100 text-[#f95721]' : 'bg-[#2d221b] text-[#f5efe8]')} font-bold text-xs flex items-center justify-center shrink-0 border ${isLight ? 'border-orange-200' : 'border-white/10'}`}>
              {selectedConv.avatarInitials}
            </div>
            <div>
              <h3 className={`font-serif-display text-sm font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                {selectedConv.renterName}
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
                {selectedConv.renterCountry} • {selectedConv.renterTripsCount} trips • {selectedConv.renterLicenseVerified ? 'ID verified' : 'ID pending'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMarkClosed}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isLight
                ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border-neutral-200'
                : 'text-[#a89b90] hover:text-white bg-[#241b15] hover:bg-[#2e231b] border-[#362a21]'
            }`}
          >
            Mark closed
          </button>
        </div>

        {/* Message Thread Area */}
        <div className={`flex-1 p-5 overflow-y-auto space-y-4 ${
          isLight ? 'bg-neutral-50/30' : ''
        }`}>
          {/* Date Separator */}
          <div className="text-center my-2">
            <span className={`text-[11px] font-medium tracking-wide ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>
              Tuesday, 26 August
            </span>
          </div>

          {selectedConv.messages.map((msg) => {
            const isPartner = msg.sender === 'partner';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPartner ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isPartner
                      ? 'bg-[#f95721] text-white shadow-sm rounded-tr-xs'
                      : isLight
                      ? 'bg-white text-neutral-800 border border-neutral-200 shadow-xs rounded-tl-xs'
                      : 'bg-[#251c16] text-[#e8ded5] border border-[#362a21] rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* PDF Attachment inside bubble */}
                  {msg.attachment && (
                    <div 
                      onClick={() => onOpenContractPdf()}
                      className="mt-2.5 p-2.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/15 flex items-center gap-2.5 cursor-pointer transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white text-[#f95721] font-bold text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                        PDF
                      </div>
                      <div className="truncate">
                        <span className="font-semibold block truncate text-[11px] text-white">{msg.attachment.fileName}</span>
                        {msg.attachment.fileSize && (
                          <span className="text-[9px] text-white/70">{msg.attachment.fileSize}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata inside bubble */}
                  <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] ${
                    isPartner ? 'text-white/80 justify-end' : isLight ? 'text-neutral-400' : 'text-[#8d7e73]'
                  }`}>
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                    {isPartner && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-0.5">
                          Read <CheckCheck className="w-3 h-3 text-white" />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SAVED REPLIES section */}
        <div className={`px-5 pt-3 border-t transition-colors ${
          isLight ? 'bg-white border-neutral-100' : 'bg-[#1a130f] border-[#261d16]'
        }`}>
          <span className={`text-[10px] font-bold tracking-wider uppercase block mb-2 ${
            isLight ? 'text-neutral-400' : 'text-[#8d7e73]'
          }`}>
            SAVED REPLIES
          </span>
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {savedReplies.map((reply) => (
              <button
                key={reply.id}
                type="button"
                onClick={() => handleApplySavedReply(reply)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                  isLight
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                    : 'bg-[#241b15] hover:bg-[#2f221a] text-[#c9b8ab] hover:text-white border-[#382b21]'
                }`}
              >
                {reply.title}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleApplySavedReply({ id: 'custom', title: 'Manage', content: 'Salam! We have verified your booking details.' })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed transition-all cursor-pointer ${
                isLight
                  ? 'text-neutral-500 hover:text-neutral-800 border-neutral-300'
                  : 'text-[#8d7e73] hover:text-white border-[#382b21]'
              }`}
            >
              Manage
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className={`p-4 pt-2 border-t transition-colors ${
          isLight ? 'bg-neutral-50 border-neutral-100' : 'bg-[#1d1511] border-[#261d16]'
        }`}>
          <div className="flex items-center justify-between text-[11px] pb-2">
            <div className="flex items-center gap-2">
              <button type="button" className={`p-1 transition-colors ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-[#8d7e73] hover:text-white'}`} title="Attach contract or file">
                <Paperclip className="w-4 h-4" />
              </button>
              <button type="button" className={`p-1 transition-colors ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-[#8d7e73] hover:text-white'}`} title="Send car inspection image">
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={translateToFr}
                onChange={(e) => setTranslateToFr(e.target.checked)}
                className="rounded accent-[#f95721] w-3.5 h-3.5 cursor-pointer"
              />
              <span className={`text-xs ${isLight ? 'text-neutral-600' : 'text-[#a89b90]'}`}>Translate to FR before sending</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Reply to ${selectedConv.renterName}...`}
              className={`flex-1 text-xs px-4 py-2.5 rounded-full border focus:outline-none focus:border-[#f95721] ${
                isLight
                  ? 'bg-white text-neutral-900 border-neutral-200 placeholder-neutral-400'
                  : 'bg-[#251c16] text-[#f5efe8] border-[#382b21] placeholder-[#7d6e63]'
              }`}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className="px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white font-semibold text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* COLUMN 3: Context Panel (3 cols on desktop) */}
      <div className="lg:col-span-3 xl:col-span-3 space-y-4 overflow-y-auto">
        
        {/* CARD 1: BOOKING IN QUESTION matching screenshot */}
        <div className={`rounded-3xl p-4 sm:p-5 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <span className={`text-[10px] font-bold tracking-wider uppercase block mb-3 ${
            isLight ? 'text-neutral-400' : 'text-[#8d7e73]'
          }`}>
            BOOKING IN QUESTION
          </span>

          {/* Car Image */}
          <div className="w-full h-36 rounded-2xl overflow-hidden mb-3.5 relative">
            <img
              src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
              alt="VW Golf 2025"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-semibold">
              AC-2418
            </div>
          </div>

          <h4 className={`font-serif-display text-base font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            VW Golf • 2025
          </h4>

          <div className={`mt-3 space-y-1.5 text-xs ${isLight ? 'text-neutral-600' : 'text-[#a89b90]'}`}>
            <div className="flex items-center justify-between">
              <span>Pick-up</span>
              <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>Thu 3 Sep, 10:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>Al Massira • T1</span>
            </div>
            <div className={`flex items-center justify-between pt-1 border-t ${
              isLight ? 'border-neutral-100' : 'border-[#261d16]'
            }`}>
              <span>Total • deposit</span>
              <span className="font-bold text-[#f95721]">{formatPrice(2450)} • {formatPrice(2000)}</span>
            </div>
          </div>

          {/* Action Buttons: [Confirm delivery] & [Open agreement] */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setDeliveryConfirmedState(true);
                onConfirmDelivery('booking-2418');
              }}
              className="w-full py-2.5 px-3 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white font-bold text-xs transition-all shadow-xs active:scale-95 text-center cursor-pointer"
            >
              {deliveryConfirmedState ? 'Delivery Confirmed' : 'Confirm delivery'}
            </button>
            <button
              type="button"
              onClick={() => onOpenContractPdf('AC-2418')}
              className={`w-full py-2.5 px-3 rounded-full border font-semibold text-xs transition-all active:scale-95 text-center cursor-pointer flex items-center justify-center gap-1 ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                  : 'bg-[#241b15] hover:bg-[#2f221a] text-[#f5efe8] border-[#382b21]'
              }`}
            >
              <span>Open agreement</span>
              <ExternalLink className="w-3 h-3 text-[#f95721]" />
            </button>
          </div>
        </div>

        {/* CARD 2: RENTER Profile Card */}
        <div className={`rounded-3xl p-4 sm:p-5 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <span className={`text-[10px] font-bold tracking-wider uppercase block mb-3 ${
            isLight ? 'text-neutral-400' : 'text-[#8d7e73]'
          }`}>
            RENTER
          </span>

          <div className={`space-y-2 text-xs ${isLight ? 'text-neutral-600' : 'text-[#a89b90]'}`}>
            <div className="flex items-center justify-between">
              <span>Trips with you</span>
              <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>3 • no incidents</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Licence</span>
              <span className="font-semibold text-emerald-500 flex items-center gap-1">
                <Check className="w-3 h-3" /> Verified 14 Mar
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Languages</span>
              <span className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>FR • EN</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              type="button"
              className={`py-2 px-3 rounded-full border font-medium text-xs transition-all text-center cursor-pointer ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                  : 'bg-[#241b15] hover:bg-[#2f221a] text-[#c9b8ab] hover:text-white border-[#382b21]'
              }`}
            >
              View profile
            </button>
            <button
              type="button"
              onClick={() => onOpenContractPdf('past-1')}
              className={`py-2 px-3 rounded-full border font-medium text-xs transition-all text-center cursor-pointer ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                  : 'bg-[#241b15] hover:bg-[#2f221a] text-[#c9b8ab] hover:text-white border-[#382b21]'
              }`}
            >
              Past agreements
            </button>
          </div>
        </div>

        {/* CARD 3: HOUSE RULES */}
        <div className={`rounded-3xl p-4 sm:p-5 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
        }`}>
          <span className={`text-[10px] font-bold tracking-wider uppercase block mb-2 ${
            isLight ? 'text-neutral-400' : 'text-[#8d7e73]'
          }`}>
            HOUSE RULES
          </span>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-[#a89b90]'}`}>
            No off-platform payments. Keep every arrangement here — Airbcar reads this thread if a dispute is opened.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={onEscalateDispute}
              className={`flex-1 py-2 px-3 rounded-full font-medium text-xs transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-[#241b15] hover:bg-amber-950/40 text-amber-300 border border-amber-900/40'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Escalate to Airbcar</span>
            </button>
            <button
              type="button"
              className={`py-2 px-3 rounded-full font-medium text-xs transition-all text-center cursor-pointer ${
                isLight
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-[#241b15] hover:bg-red-950/40 text-red-300 border border-red-900/40'
              }`}
              title="Report Renter"
            >
              <Flag className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
