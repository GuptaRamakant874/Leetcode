import { useEffect, useRef } from 'react';

const GOOGLE_SCRIPT_ID = 'google-identity-services';
let isGoogleInitialized = false;

function GoogleAuthButton({ text = 'continue_with', onCredentialResponse, disabled = false }) {
  const buttonRef = useRef(null);
  const callbackRef = useRef(onCredentialResponse);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    callbackRef.current = onCredentialResponse;
  }, [onCredentialResponse]);

  useEffect(() => {
    if (!clientId || !buttonRef.current || disabled) {
      return undefined;
    }

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return;
      }

      buttonRef.current.innerHTML = '';

      if (!isGoogleInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential) {
              callbackRef.current?.(response.credential);
            }
          },
        });

        isGoogleInitialized = true;
      }

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text,
        width: 320,
      });
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (existingScript) {
      if (window.google?.accounts?.id) {
        renderGoogleButton();
      } else {
        existingScript.addEventListener('load', renderGoogleButton, { once: true });
      }

      return undefined;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      document.body.appendChild(script);

      return undefined;
  }, [clientId, disabled, text]);

  if (!clientId) {
    return (
      <button type="button" className="btn btn-outline w-full" disabled>
        Google Sign-In Not Configured
      </button>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div ref={buttonRef} />
    </div>
  );
}

export default GoogleAuthButton;
