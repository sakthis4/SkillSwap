import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types';

interface VideoCallModalProps {
  partner: User;
  onClose: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ partner, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraError, setIsCameraError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraError(false);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setIsCameraError(true);
        if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setErrorMessage('Camera access was denied. Please allow access in your browser settings to use video chat.');
          } else if (err.name === 'NotFoundError') {
            setErrorMessage('No camera or microphone found. Please check that they are connected and enabled.');
          } else {
            setErrorMessage('Could not access camera. It might be used by another application.');
          }
        } else {
          setErrorMessage('An unexpected error occurred while accessing the camera.');
        }
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop the stream when the component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col relative transform transition-all scale-95 animate-zoom-in">
        {/* Main video area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-full min-h-0">
            {/* Partner's "video" */}
            <div className="bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden relative">
                <div className="text-center">
                     <img src={partner.avatar} alt={partner.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-400" />
                     <p className="font-semibold text-xl">{partner.name}</p>
                     <div className="flex justify-center items-center space-x-2 mt-4">
                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-gray-400 ml-2">Joining Live Video Session...</span>
                    </div>
                </div>
                 <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                    {partner.name}
                 </div>
                 <div className="absolute bottom-2 right-2 text-xs text-gray-500">Powered by Zoom integration</div>
            </div>

            {/* User's video */}
            <div className="bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden relative">
                {isCameraError ? (
                    <div className="text-center text-red-400 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /><path d="M15 10l4.55a1 1 0 011.45.89V15.1a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        {errorMessage}
                    </div>
                ) : (
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform -scale-x-100"></video>
                )}
                 <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                    You
                 </div>
            </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center py-4">
            <button
              onClick={handleClose}
              className="bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 flex items-center space-x-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telephone-x-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.28 1.465l-2.13 2.13a1.08 1.08 0 0 0-.288.701l-1.27 4.243a.5.5 0 0 0 .49.589h.035a.5.5 0 0 0 .42-.23l.16-.298a1.43 1.43 0 0 0-.21-.399l-.875-1.46a.5.5 0 0 1 .17-.707l2.63-1.753a.5.5 0 0 0 .163-.448l.26-2.503a.5.5 0 0 1 .49-.45h.035a.5.5 0 0 1 .42.23l.85,1.274c.12.18.25.348.39.508l-1.12,1.12a.5.5 0 0 0-.163.448l-.26,2.503a.5.5 0 0 0 .49.45h.035a.5.5 0 0 0 .42-.23l2.06-2.06a.5.5 0 0 1 .708 0l.707.707a.5.5 0 0 1 0 .708l-2.06 2.06a.5.5 0 0 0-.23.42h.035a.5.5 0 0 0 .45.49l2.503.26a.5.5 0 0 0 .448-.163l1.753-2.63a.5.5 0 0 1 .707-.17l1.46.875c.15.09.32.17.5.21l.298.16a.5.5 0 0 0 .23.42h.035a.5.5 0 0 0 .589-.49l-4.243-1.27a1.08 1.08 0 0 0-.701-.288l-2.13-2.13c-.491-.165-1.042-.049-1.465.28l-2.46 2.46a1.745 1.745 0 0 1-2.61-.164L1.885.51zM11.96 8.54a.5.5 0 0 0-.707 0L9.5 10.293 7.75 8.54a.5.5 0 0 0-.707.708L8.793 11l-1.75 1.75a.5.5 0 0 0 .707.707L9.5 11.707l1.75 1.75a.5.5 0 0 0 .707-.707L10.207 11l1.75-1.75a.5.5 0 0 0 0-.708z"/>
                </svg>
              <span>Leave Session</span>
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes zoom-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
            animation: zoom-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoCallModal;