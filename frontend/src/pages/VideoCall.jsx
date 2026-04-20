import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { motion } from "framer-motion";
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Copy, Check } from "lucide-react";

const VideoCall = () => {
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [copied, setCopied] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const callRef = useRef(null);

    useEffect(() => {
        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", (id) => {
            setPeerId(id);
        });

        peer.on("call", (call) => {
            setIncomingCall(call);
        });

        return () => {
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            peer.destroy();
        };
    }, []);

    const startLocalStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        return stream;
    };

    const callPeer = async () => {
        if (!remotePeerId.trim()) return;
        setIsCalling(true);

        try {
            const stream = await startLocalStream();
            const call = peerRef.current.call(remotePeerId, stream);
            callRef.current = call;

            call.on("stream", (remoteStream) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }
                setIsConnected(true);
                setIsCalling(false);
            });

            call.on("close", () => {
                endCall();
            });
        } catch (err) {
            console.error("Error starting call:", err);
            setIsCalling(false);
        }
    };

    const answerCall = async () => {
        if (!incomingCall) return;

        try {
            const stream = await startLocalStream();
            incomingCall.answer(stream);

            incomingCall.on("stream", (remoteStream) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }
                setIsConnected(true);
            });

            incomingCall.on("close", () => {
                endCall();
            });

            callRef.current = incomingCall;
            setIncomingCall(null);
        } catch (err) {
            console.error("Error answering call:", err);
        }
    };

    const endCall = () => {
        callRef.current?.close();
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        setIsConnected(false);
        setIsCalling(false);
        setIncomingCall(null);
        callRef.current = null;
        localStreamRef.current = null;
    };

    const toggleVideo = () => {
        const track = localStreamRef.current?.getVideoTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setVideoEnabled(track.enabled);
        }
    };

    const toggleAudio = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setAudioEnabled(track.enabled);
        }
    };

    const copyPeerId = () => {
        navigator.clipboard.writeText(peerId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
            <motion.div
                className="max-w-5xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    📹 Video Consultation
                </h1>

                {/* Peer ID Display */}
                {!isConnected && (
                    <motion.div
                        className="bg-gray-700 rounded-2xl p-6 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-gray-300 text-sm mb-2">Your Room ID:</p>
                        <div className="flex items-center gap-3">
                            <code className="bg-gray-800 text-green-400 px-4 py-2 rounded-lg text-lg font-mono flex-1">
                                {peerId || "Connecting..."}
                            </code>
                            <button
                                onClick={copyPeerId}
                                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                                title="Copy Room ID"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                            Share this ID with your patient/doctor to start the call
                        </p>

                        {/* Join Call */}
                        <div className="mt-4 flex gap-3">
                            <input
                                type="text"
                                value={remotePeerId}
                                onChange={(e) => setRemotePeerId(e.target.value)}
                                placeholder="Enter the other person's Room ID"
                                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={callPeer}
                                disabled={isCalling || !remotePeerId.trim()}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-2 font-semibold"
                            >
                                <Phone className="w-5 h-5" />
                                {isCalling ? "Calling..." : "Call"}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Incoming Call Alert */}
                {incomingCall && !isConnected && (
                    <motion.div
                        className="bg-green-900 rounded-2xl p-6 mb-6 text-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                    >
                        <p className="text-white text-xl mb-4">📞 Incoming Video Call...</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={answerCall}
                                className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition cursor-pointer flex items-center gap-2 font-semibold"
                            >
                                <Phone className="w-5 h-5" /> Answer
                            </button>
                            <button
                                onClick={() => setIncomingCall(null)}
                                className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition cursor-pointer flex items-center gap-2 font-semibold"
                            >
                                <PhoneOff className="w-5 h-5" /> Decline
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Video Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Remote Video (Large) */}
                    <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video md:col-span-2">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        {!isConnected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-gray-500 text-lg">
                                    {isCalling ? "Connecting..." : "Waiting for connection..."}
                                </p>
                            </div>
                        )}

                        {/* Local Video (Picture-in-Picture) */}
                        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-600 shadow-lg">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {!localStreamRef.current && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500 text-xs">Camera off</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                {isConnected && (
                    <motion.div
                        className="flex justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            onClick={toggleVideo}
                            className={`p-4 rounded-full transition cursor-pointer ${
                                videoEnabled ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-red-600 text-white"
                            }`}
                            title={videoEnabled ? "Turn off camera" : "Turn on camera"}
                        >
                            {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={toggleAudio}
                            className={`p-4 rounded-full transition cursor-pointer ${
                                audioEnabled ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-red-600 text-white"
                            }`}
                            title={audioEnabled ? "Mute" : "Unmute"}
                        >
                            {audioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={endCall}
                            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                            title="End call"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}

                {/* Instructions */}
                {!isConnected && !incomingCall && (
                    <div className="mt-6 text-center text-gray-400 text-sm">
                        <p className="mb-2"><strong>How to use:</strong></p>
                        <p>1. Share your <strong>Room ID</strong> with the other person</p>
                        <p>2. They paste your ID and click <strong>Call</strong></p>
                        <p>3. Or paste their ID and call them — either way works!</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VideoCall;
