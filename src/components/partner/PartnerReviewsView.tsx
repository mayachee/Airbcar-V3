import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Send 
} from 'lucide-react';
import { PartnerReview, PartnerProfile } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerReviewsViewProps {
  reviews: PartnerReview[];
  partnerProfile: PartnerProfile;
}

export const PartnerReviewsView: React.FC<PartnerReviewsViewProps> = ({
  reviews: initialReviews,
  partnerProfile,
}) => {
  const { isLight, t } = useAccountSettings();
  const [reviews, setReviews] = useState<PartnerReview[]>(initialReviews);
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendResponse = (reviewId: string) => {
    if (!replyText.trim()) return;

    setReviews(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        return {
          ...rev,
          partnerResponse: {
            text: replyText.trim(),
            date: 'Today',
          },
        };
      }
      return rev;
    }));

    setReplyingReviewId(null);
    setReplyText('');
  };

  return (
    <div className={`p-6 lg:p-9 space-y-7 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f95721] bg-[#f95721]/15 px-3 py-1 rounded-full border border-[#f95721]/30">
              Agency Reputation
            </span>
          </div>
          <h2 className={`font-serif-display text-2xl font-bold mt-1 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {t('reviews', 'Customer Reviews')} ({partnerProfile.reviewCount})
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
            DRF Endpoints: <code className="text-[#f95721] text-[10px]">/partners/me/reviews/</code> and <code className="text-[#f95721] text-[10px]">/reviews/&lt;id&gt;/respond/</code>
          </p>
        </div>

        {/* Rating badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-neutral-200 shadow-xs' : 'bg-[#1a130f] border-[#2e231c]'
        }`}>
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className={`text-xl font-extrabold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
            {partnerProfile.rating}
          </span>
          <span className={`text-xs ${isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}`}>/ 5.0</span>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`rounded-3xl p-6 border space-y-4 shadow-xs transition-colors ${
              isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center border ${
                  isLight ? 'bg-orange-100 text-[#f95721] border-orange-200' : 'bg-[#281e18] text-[#f5efe8] border-white/10'
                }`}>
                  {rev.renterAvatar}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                    {rev.renterName}
                  </h4>
                  <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                    {rev.vehicleName} • {rev.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <Star 
                    key={starIndex} 
                    className={`w-4 h-4 ${
                      starIndex <= Math.round(rev.rating || 5)
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-neutral-700'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-700' : 'text-[#d8cbc1]'}`}>
              "{rev.comment}"
            </p>

            {/* Partner Response if exists */}
            {rev.partnerResponse ? (
              <div className={`p-4 rounded-2xl border space-y-1 text-xs transition-colors ${
                isLight ? 'bg-orange-50/60 border-orange-200' : 'bg-[#241a14] border-[#3b2a1f]'
              }`}>
                <div className="flex items-center justify-between text-[11px] text-[#f95721] font-semibold">
                  <span>Response from Mayache Cars</span>
                  <span className={isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}>{rev.partnerResponse.date}</span>
                </div>
                <p className={isLight ? 'text-neutral-800' : 'text-[#e2d5cb]'}>{rev.partnerResponse.text}</p>
              </div>
            ) : replyingReviewId === rev.id ? (
              <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
              }`}>
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a public response as Mayache Cars..."
                  className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-[#f95721] ${
                    isLight 
                      ? 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400' 
                      : 'bg-[#281d16] border-[#382b21] text-[#f5efe8]'
                  }`}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyingReviewId(null)}
                    className={`px-3 py-1.5 rounded-full text-xs cursor-pointer ${
                      isLight ? 'text-neutral-500 hover:text-neutral-900' : 'text-[#8d7e73] hover:text-white'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendResponse(rev.id)}
                    className="px-4 py-1.5 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Response</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setReplyingReviewId(rev.id);
                  setReplyText('');
                }}
                className="text-xs text-[#f95721] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reply to review</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
