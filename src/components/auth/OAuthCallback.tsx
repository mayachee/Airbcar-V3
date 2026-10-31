import React, { useEffect } from 'react';

export const OAuthCallback: React.FC = () => {
  useEffect(() => {
    try {
      const hash = window.location.hash.substring(1);
      const search = window.location.search.substring(1);
      const params = new URLSearchParams(hash || search);
      const token = params.get('access_token') || params.get('id_token');
      const code = params.get('code');
      const error = params.get('error') || params.get('error_description');

      if (window.opener) {
        if (error) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error }, '*');
        } else {
          window.opener.postMessage(
            {
              type: 'OAUTH_AUTH_SUCCESS',
              token,
              code,
              raw: window.location.href,
            },
            '*'
          );
        }
        window.close();
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Callback error:', err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#140e0c] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full border-2 border-[#f95721] border-t-transparent animate-spin mb-4" />
      <h2 className="text-lg font-bold">Completing Airbcar Authentication...</h2>
      <p className="text-xs text-[#a8988a] mt-1">This window will close automatically and return you to Airbcar.</p>
    </div>
  );
};
