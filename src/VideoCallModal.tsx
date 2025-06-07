import { useEffect, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface VideoCallModalProps {
  roomUrl: string;
  roomId: Id<"dailyRooms">;
  onClose: () => void;
}

export function VideoCallModal({ roomUrl, roomId, onClose }: VideoCallModalProps) {
  const callFrameRef = useRef<HTMLDivElement>(null);
  const [callFrame, setCallFrame] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);

  const leaveDailyRoom = useMutation(api.dailyRooms.leaveDailyRoom);

  useEffect(() => {
    if (!callFrameRef.current) return;

    const frame = DailyIframe.createFrame(callFrameRef.current, {
      iframeStyle: {
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "8px",
      },
      showLeaveButton: false,
      showFullscreenButton: true,
      showLocalVideo: true,
      showParticipantsBar: true,
    });

    setCallFrame(frame);

    frame.on("joined-meeting", (event: any) => {
      setIsJoined(true);
      setIsConnecting(false);
      setIsCameraOn(event.participants.local.video);
      setIsMicOn(event.participants.local.audio);
    });

    frame.on("left-meeting", () => {
      setIsJoined(false);
      handleLeave();
    });

    frame.on("participant-joined", (event: any) => {
      setParticipants(prev => [...prev, event.participant]);
    });

    frame.on("participant-left", (event: any) => {
      setParticipants(prev => prev.filter(p => p.session_id !== event.participant.session_id));
    });

    frame.on("camera-error", (event: any) => {
      console.error("Erro na câmera:", event);
      setIsCameraOn(false);
    });

    frame.on("error", (event: any) => {
      console.error("Erro na chamada:", event);
      setIsConnecting(false);
    });

    // Entrar na sala
    frame.join({ 
      url: roomUrl,
      userName: "Usuário",
    }).catch((error: any) => {
      console.error("Erro ao entrar na sala:", error);
      setIsConnecting(false);
    });

    return () => {
      if (frame) {
        frame.destroy();
      }
    };
  }, [roomUrl]);

  const handleLeave = async () => {
    try {
      await leaveDailyRoom({ roomId });
      if (callFrame) {
        callFrame.leave();
      }
      onClose();
    } catch (error) {
      console.error("Erro ao sair da chamada:", error);
      onClose();
    }
  };

  const toggleCamera = async () => {
    if (callFrame) {
      const newState = !isCameraOn;
      await callFrame.setLocalVideo(newState);
      setIsCameraOn(newState);
    }
  };

  const toggleMicrophone = async () => {
    if (callFrame) {
      const newState = !isMicOn;
      await callFrame.setLocalAudio(newState);
      setIsMicOn(newState);
    }
  };

  const toggleScreenShare = async () => {
    if (callFrame) {
      const isScreenSharing = callFrame.participants()?.local?.screen;
      if (isScreenSharing) {
        await callFrame.stopScreenShare();
      } else {
        await callFrame.startScreenShare();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="w-full h-full max-w-7xl max-h-[95vh] bg-gray-900 rounded-lg overflow-hidden">
        {/* Header da chamada */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isJoined ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <span className="text-white font-medium">
              {isConnecting ? "Conectando..." : `Chamada de vídeo • ${participants.length + (isJoined ? 1 : 0)} participante(s)`}
            </span>
          </div>
          <button
            onClick={handleLeave}
            className="text-gray-400 hover:text-white transition-colors"
            title="Fechar chamada"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Área do vídeo */}
        <div className="relative h-[calc(100%-120px)]">
          <div ref={callFrameRef} className="w-full h-full bg-gray-800" />
          
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Conectando à chamada...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controles da chamada */}
        <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
          <button
            onClick={toggleMicrophone}
            className={`p-3 rounded-full transition-colors ${
              isMicOn 
                ? "bg-gray-700 hover:bg-gray-600" 
                : "bg-red-600 hover:bg-red-700"
            }`}
            title={isMicOn ? "Desligar microfone" : "Ligar microfone"}
          >
            <i className={`fas ${isMicOn ? "fa-microphone" : "fa-microphone-slash"} text-white`}></i>
          </button>
          
          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-colors ${
              isCameraOn 
                ? "bg-gray-700 hover:bg-gray-600" 
                : "bg-red-600 hover:bg-red-700"
            }`}
            title={isCameraOn ? "Desligar câmera" : "Ligar câmera"}
          >
            <i className={`fas ${isCameraOn ? "fa-video" : "fa-video-slash"} text-white`}></i>
          </button>

          <button
            onClick={toggleScreenShare}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            title="Compartilhar tela"
          >
            <i className="fas fa-desktop text-white"></i>
          </button>
          
          <button
            onClick={handleLeave}
            className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            title="Encerrar chamada"
          >
            <i className="fas fa-phone-slash text-white"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
