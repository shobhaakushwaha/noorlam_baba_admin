import React, { useEffect, useRef, useState, useCallback } from "react";
import "./ChatBox.scss";
import CustomModal from "./CustomModal";
import socket from "socket/socket";
import { logger } from "utils/logger";
import { IoSend, IoAttach, IoClose } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { RiCustomerService2Fill } from "react-icons/ri";

// Get admin details from localStorage
const getAdminDetails = () => {
  try {
    const adminDetail = localStorage.getItem("naksha_admin-detail");
    return adminDetail ? JSON.parse(adminDetail) : null;
  } catch (error) {
    console.error("Error parsing admin details:", error);
    return null;
  }
};

const ChatModal = ({
  show = false,
  onClose,
  heading,
  onConfirm,
  selectedChat,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(socket?.connected || false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesRef = useRef(null); 
  const fileInputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Format time helper
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Send message handler
  const sendMessage = useCallback(() => {
    if (!input.trim() && !selectedFile) return;
    if (!selectedChat?.roomId) {
      console.error("No roomId available");
      return;
    }

    const adminDetails = getAdminDetails();
    const adminId = adminDetails?._id || adminDetails?.id;

    const receiverUserId =
      selectedChat?.userId ||
      selectedChat?.createdBy ||
      selectedChat?.user?._id ||
      selectedChat?.user;

    if (!adminId) {
      console.error("Admin ID not found");
      return;
    }

    if (!receiverUserId) {
      console.error("Receiver User ID not found in selectedChat");
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const payload = {
      roomId: selectedChat.roomId,
      senderId: adminId,
      receiverId: receiverUserId,
      messageType: selectedFile ? "file" : "text",
      message: input.trim(),
      media: selectedFile || null,
    };

    logger.log("Sending message with payload:", payload);

    socket?.emit("sendMessage", payload, (response) => {
      logger.log("sendMessage callback:", response);

      if (response?.status !== 200 && response?.error) {
        console.error("Failed to send message:", response.error);
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
      }
    });

    // Add message to local state immediately for better UX (right side)
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     _id: tempId,
    //     role: "admin",
    //     text: input,
    //     time: new Date().toISOString(),
    //     messageType: selectedFile ? "file" : "text",
    //     media: selectedFile,
    //   },
    // ]);

    setInput("");
    setSelectedFile(null);
  }, [input, selectedFile, selectedChat]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          data: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Socket connection and event listeners
  useEffect(() => {
    if (!show || !socket) return;

    const roomId = selectedChat?.roomId;
    const chatUserId = selectedChat?.userId || selectedChat?.createdBy;

    if (!roomId) {
      console.warn("No roomId available to fetch messages");
      return;
    }

    console.log("Setting up socket connection and listeners...");
    console.log("Selected Chat Data:", selectedChat);
    console.log("Room ID:", roomId);

    const fetchMessages = () => {
      console.log("Emitting joinRoom and chatMessage with roomId:", roomId);
      setIsLoading(true);
      socket.emit("joinRoom", roomId);
      socket.emit("chatMessage", { roomId });
    };

    const onConnect = () => {
      console.log("Socket connected!");
      setIsConnected(true);
      fetchMessages();
    };

    const onDisconnect = () => {
      console.log("Socket disconnected!");
      setIsConnected(false);
    };



    // Handle receiving messages list (history)
    const handleReceiveMessages = (response) => {
      logger.log("receiveMessages:", response);

      setIsLoading(false);

      if (response?.status === 200) {
        const messageData = response?.result || response?.data || [];

        // Get admin ID for role detection
        const adminDetails = getAdminDetails();

        const adminId = adminDetails?._id;

        const formattedMessages = (
          Array.isArray(messageData) ? messageData : []
        ).map((msg) => {
          const msgReceiverId = msg.receiverId?._id || msg.receiverId;
          const msgSenderId = msg.senderId;

          // Determine if admin sent this message:
          // 1. senderType field says "admin"
          // 2. senderId matches the admin's ID
          // 3. receiverId matches the chat user (admin sent TO user)
          const isAdminMessage =
            // msg.senderType === "admin" ||
            String(msgSenderId) === String(adminId)
            // String(msgReceiverId) === String(chatUserId);

          return {
            _id: msg._id || msg.id,
            role: isAdminMessage ? "admin" : "user",
            text: msg.message || msg.text || "",
            time: msg.createdAt || msg.timestamp,
            messageType: msg.messageType || "text",
            media: msg.media,
            senderId:msgSenderId
          };
        });

        setMessages(formattedMessages);
      }
    };

    // Handle receiving a single new real-time message
    const handleReceiveMessage = (response) => {
      const msg = response?.data || response?.result || response;
      console.log("msg",msg)
      if (!msg || !msg.roomId) return;

      // Get admin ID to compare against senderId
      const adminDetails = getAdminDetails();
      const adminId = adminDetails?._id;

      // Get senderId from the message (handle both populated object and plain ID)
      const msgSenderId =  msg?.senderInfo?._id

      // Ignore admin's own messages — already added locally via optimistic update
      // Your server returns senderId: '696df8bde16f451803bbdd7e' which matches admin _id
      if (
        msg.senderType === "admin" ||
        String(msgSenderId) === String(adminId)
      ) {
        return;
      }

      const msgId = msg._id || msg.id;

      setMessages((prev) => {
        // Deduplicate — skip if message already exists
        if (msgId && prev.some((m) => m._id === msgId)) return prev;

        return [
          ...prev,
          {
            _id: msgId,
            role:(!msgSenderId || String(adminId) === String(msgSenderId))?"admin":"user",
            text: msg.message || "",
            time: msg.createdAt,
            messageType: msg.messageType || "text",
            media: msg.media,
            // senderId:
          },
        ];
      });
    };

    // Clear previous messages BEFORE registering listeners
    setMessages([]);

    // Register listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveMessages", handleReceiveMessages);
    socket.on("receiveMessage", handleReceiveMessage);

    // Connect if not connected, otherwise fetch immediately
    if (!socket.connected) {
      console.log("Socket not connected, connecting now...");
      socket.connect();
    } else {
      console.log("Socket already connected");
      setIsConnected(true);
      fetchMessages();
    }

    // Cleanup
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receiveMessages", handleReceiveMessages);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [show, selectedChat?.roomId, selectedChat?.userId, selectedChat?.createdBy]);

  // Clear state only when modal closes
  useEffect(() => {
    if (!show) {
      setMessages([]);
      setInput("");
      setSelectedFile(null);
      setIsLoading(false);
    }
  }, [show]);

  const handleCloseTicket = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  console.log(messages,"messages")

  return (
    <CustomModal
      className="chatModal xl"
      show={show}
      handleClose={onClose}
      closeButton={true}
    >
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header-section">
          <div className="user-info">
            <div className="avatar">
              <FiUser />
            </div>
            <div className="user-details">
              <h4>{selectedChat?.userName || "User"}</h4>
              <span className="user-role">
                {selectedChat?.userRole?.[0] || "Customer"}
              </span>
            </div>
          </div>
          <div className="header-right">
            <div className="ticket-info">
              <span className="ticket-number">
                {selectedChat?.ticketNumber || "N/A"}
              </span>
              <span
                className={`ticket-status ${selectedChat?.ticketStatus || "open"}`}
              >
                {selectedChat?.ticketStatus || "Open"}
              </span>
            </div>
            <div className="connection-status">
              <span
                className={`status-dot ${isConnected ? "online" : "offline"}`}
              ></span>
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-container" ref={messagesRef}>
          {isLoading ? (
            <div className="loading-messages">
              <div className="spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="no-messages">
              <RiCustomerService2Fill className="empty-icon" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={msg._id || `msg-${i}`}
                className={`message-wrapper ${msg.role}`}
              >
                <div className="message-bubble">
                  {msg.messageType === "file" && msg.media && (
                    <div className="message-media">
                      {msg.media.type?.startsWith("image") ? (
                        <img
                          src={msg.media.data || msg.media}
                          alt="attachment"
                        />
                      ) : (
                        <div className="file-attachment">
                          <IoAttach />
                          <span>{msg.media.name || "File"}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {msg.text && <p className="message-text">{msg.text}</p>}
                  <span className="message-time">{formatTime(msg.time)}</span>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="message-wrapper user">
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="file-preview">
            <div className="file-info">
              <IoAttach />
              <span>{selectedFile.name}</span>
            </div>
            <button
              className="remove-file"
              onClick={() => setSelectedFile(null)}
            >
              <IoClose />
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-section">
          {/* <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
            accept="image/*,.pdf,.doc,.docx"
          /> */}
          {/* <button
            className="attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <IoAttach />
          </button> */}
          <input
            type="text"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
            disabled={!isConnected}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!isConnected || (!input.trim() && !selectedFile)}
          >
            <IoSend />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="chat-footer">
          <button className="btn-close-ticket" onClick={handleCloseTicket}>
            Close Ticket
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ChatModal;