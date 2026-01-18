import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
  type User,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { generateStreamToken, getDepartmentCallId } from "../../api/stream.api";
import { updateMeeting, getMeetingById } from "../../api/meeting.api";
import { useUser } from "../../hooks/useUser";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function VideoCall() {
  const { userProfile } = useUser();
  const [searchParams] = useSearchParams();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callInfo, setCallInfo] = useState<{
    callId: string;
    departmentName: string | null;
  } | null>(null);
  const meetingId = searchParams.get("meetingId");
  const callRef = useRef<any>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const isHostRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const initializeCall = async () => {
      // Check if current user is the meeting host
      if (meetingId && userProfile?.id) {
        try {
          const meeting = await getMeetingById(meetingId);
          isHostRef.current = meeting.createdById === userProfile.id;
        } catch (error) {
          console.error("Error checking host status:", error);
          isHostRef.current = false;
        }
      }

      try {
        setIsLoading(true);
        setError(null);

        // Check if callId is provided in URL params
        const callIdFromUrl = searchParams.get("callId");
        let departmentInfo;
        let callIdToUse: string;

        if (callIdFromUrl) {
          // Use provided callId
          callIdToUse = callIdFromUrl;
          departmentInfo = {
            callId: callIdFromUrl,
            departmentId: 0,
            departmentName: null,
          };
        } else {
          // Get department call ID for current user
          departmentInfo = await getDepartmentCallId();
          callIdToUse = departmentInfo.callId;
        }

        if (!mounted) return;

        // Generate Stream token (anyone can join, no access verification needed)
        const tokenData = await generateStreamToken(callIdToUse);

        if (!mounted) return;

        // Set up user object
        const user: User = {
          id: tokenData.userId,
          name: tokenData.userName || userProfile?.fullName || "User",
          image: tokenData.userImage || undefined,
        };

        // Initialize Stream client
        const streamClient = new StreamVideoClient({
          apiKey: tokenData.apiKey,
          user,
          token: tokenData.token,
        });

        // Create and join call
        const streamCall = streamClient.call("default", callIdToUse);
        await streamCall.join({ create: true });

        if (!mounted) return;

        setClient(streamClient);
        setCall(streamCall);
        callRef.current = streamCall;
        clientRef.current = streamClient;
        setCallInfo({
          callId: callIdToUse,
          departmentName: departmentInfo.departmentName,
        });
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error initializing call:", err);
        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Không thể khởi tạo cuộc gọi. Vui lòng thử lại."
          );
          setIsLoading(false);
          toast.error("Không thể khởi tạo cuộc gọi");
        }
      }
    };

    if (userProfile) {
      initializeCall();
    }

    // Cleanup function
    return () => {
      mounted = false;
      const leaveCall = async () => {
        try {
          const currentCall = callRef.current;
          const currentClient = clientRef.current;
          const isHost = isHostRef.current;

          if (currentCall) {
            if (isHost && meetingId) {
              // If host leaves, end the call for all participants
              try {
                // Use endCall() to end the call for all participants
                await currentCall.endCall();
                // Update meeting status to COMPLETED when host ends call
                try {
                  await updateMeeting(meetingId, { status: "COMPLETED" });
                } catch (error) {
                  console.error("Error updating meeting status:", error);
                }
              } catch (error) {
                console.error("Error ending call:", error);
                // Fallback to leave if endCall fails
                await currentCall.leave().catch(console.error);
              }
            } else {
              // Regular participant just leaves
              await currentCall.leave().catch(console.error);
            }
          }
          if (currentClient) {
            await currentClient.disconnectUser().catch(console.error);
          }
        } catch (error) {
          console.error("Error leaving call:", error);
        }
      };
      leaveCall();
    };
  }, [userProfile, searchParams, meetingId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Đang khởi tạo cuộc gọi...</p>
          {callInfo && (
            <p className="text-gray-400 mt-2">
              Phòng ban: {callInfo.departmentName}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
            <h2 className="text-red-400 text-xl font-semibold mb-2">
              Không thể tham gia cuộc gọi
            </h2>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-gray-900">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <VideoCallUI callInfo={callInfo} />
        </StreamCall>
      </StreamVideo>
    </div>
  );
}

function VideoCallUI({
  callInfo,
}: {
  callInfo: { callId: string; departmentName: string | null } | null;
}) {
  const call = useCall();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Đang kết nối...</p>
          {callInfo && (
            <p className="text-gray-400 mt-2">
              Phòng ban: {callInfo.departmentName}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <StreamTheme>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-semibold">
                Video Call - {callInfo?.departmentName || "Phòng ban"}
              </h1>
              <p className="text-gray-400 text-sm">
                {participantCount} người tham gia
              </p>
            </div>
            <div className="text-gray-400 text-sm">Call ID: {call?.id}</div>
          </div>
        </div>

        {/* Video Layout */}
        <div className="flex-1 min-h-0">
          <SpeakerLayout participantsBarPosition="bottom" />
        </div>

        {/* Call Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
}
