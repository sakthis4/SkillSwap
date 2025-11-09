
import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types';

interface VideoCallModalProps {
  currentUser: User;
  partner: User;
  onClose: () => void;
}

const ControlButton: React.FC<{
  onClick: () => void;
  title: string;
  isActive?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'danger' | 'primary';
}> = ({ onClick, title, isActive = false, isDisabled = false, children, variant = 'default' }) => {
    let colorClasses = 'bg-gray-700 text-white hover:bg-gray-600';
    if (variant === 'danger' || (variant === 'default' && isActive)) {
      colorClasses = 'bg-red-600 text-white';
    } else if (variant === 'primary' && isActive) {
      colorClasses = 'bg-blue-600 text-white';
    }

    return (
        <button
            onClick={onClick}
            title={title}
            disabled={isDisabled}
            className={`p-3 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${colorClasses}`}
        >
            {children}
        </button>
    );
};


const VideoCallModal: React.FC<VideoCallModalProps> = ({ currentUser, partner, onClose }) => {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraError, setIsCameraError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        cameraStreamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
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
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const stopScreenSharing = () => {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      if (userVideoRef.current && cameraStreamRef.current) {
        userVideoRef.current.srcObject = cameraStreamRef.current;
        if (cameraStreamRef.current) {
            cameraStreamRef.current.getVideoTracks().forEach(track => track.enabled = !isCameraOff);
        }
      }
      setIsScreenSharing(false);
  };
  
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
        stopScreenSharing();
    } else {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = stream;
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                stopScreenSharing();
            });
            if (userVideoRef.current) {
                userVideoRef.current.srcObject = stream;
            }
            setIsScreenSharing(true);
            if (cameraStreamRef.current) {
                cameraStreamRef.current.getVideoTracks().forEach(track => track.enabled = false);
            }
        } catch (err) {
            console.error("Error starting screen share:", err);
        }
    }
  };
  
  const handleToggleMic = () => {
    if (cameraStreamRef.current) {
        cameraStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(prev => !prev);
    }
  };
  
  const handleToggleCamera = () => {
      if(isScreenSharing) return;
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsCameraOff(prev => !prev);
    }
  };


  const handleClose = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
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
                </div>
                 <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                    {partner.name}
                 </div>
            </div>

            {/* User's video */}
            <div className="bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden relative">
                {isCameraError ? (
                    <div className="text-center text-red-400 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /><path d="M15 10l4.55a1 1 0 011.45.89V15.1a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        {errorMessage}
                    </div>
                ) : (
                    <>
                     <video ref={userVideoRef} autoPlay muted className={`w-full h-full object-contain ${!isScreenSharing ? 'transform -scale-x-100' : ''} ${isCameraOff && !isScreenSharing ? 'hidden' : ''}`}></video>
                     {(isCameraOff && !isScreenSharing) && (
                        <div className="text-center text-gray-400">
                           <img src={currentUser.avatar} alt="Your avatar" className="w-24 h-24 rounded-full mx-auto mb-4 opacity-50" />
                            <p>Camera is off</p>
                        </div>
                     )}
                    </>
                )}
                 <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                    {isScreenSharing ? 'Your Screen' : 'You'}
                 </div>
            </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center items-center space-x-4 py-4 bg-gray-900/50">
            <ControlButton onClick={handleToggleMic} title={isMuted ? 'Unmute' : 'Mute'} isActive={isMuted}>
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5l14 14" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                )}
            </ControlButton>
            <ControlButton onClick={handleToggleCamera} title={isCameraOff ? 'Turn camera on' : 'Turn camera off'} isActive={isCameraOff} isDisabled={isScreenSharing}>
                {isCameraOff ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89V15.1a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89V15.1a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
            </ControlButton>
             <ControlButton onClick={handleToggleScreenShare} title={isScreenSharing ? 'Stop sharing' : 'Share screen'} variant="primary" isActive={isScreenSharing}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
             </ControlButton>
            <button
              onClick={handleClose}
              className="bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>Leave</span>
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
