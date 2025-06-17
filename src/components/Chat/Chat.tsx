import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { useApi } from "../../hooks/useApi";
import { ChatMessage, LayoutBlockType } from "../../types";
import {
  Send,
  MessageCircle,
  Code,
  FileText,
  Image,
  Table,
  X,
  Cpu,
  Copy,
  Check,
} from "react-feather";
import Card from "../UI/Card";
import IconButton from "../UI/IconButton";
import { documentService } from "../../api";
import { useNotification } from "../../hooks/notification/NotificationContext";

interface ChatProps {
  pdfFile: File | null;
  fileName?: string;
  onClearMessages?: ((clearMessages: () => void) => void) | null;
  onRegisterAddMessage?:
    | ((addMessage: (message: Partial<ChatMessage>) => void) => void)
    | null;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md} 0 0
    ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  justify-content: center; /* Center the title horizontally */
`;

const ChatTitle = styled.h3`
  margin: 0;
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyChatMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  margin: auto;
  text-align: center;
  max-width: 80%;

  svg {
    color: ${({ theme }) => theme.colors.neutral[600]};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h4 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
  }
`;

const MessageItem = styled.div<{ $isError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ $isError, theme }) =>
    $isError &&
    `
    .message-response {
      border-color: ${theme.colors.error};
      background-color: rgba(255, 77, 79, 0.1);
    }
  `}
`;

const UserMessage = styled(Card)`
  align-self: flex-end;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrast};
  border-radius: ${({ theme }) => theme.borderRadius.md}
    ${({ theme }) => theme.borderRadius.md} 0
    ${({ theme }) => theme.borderRadius.md};
  max-width: 90%;
  word-break: break-word;
`;

const UserMessageContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  span {
    flex: 1;
  }
`;

const BotMessage = styled(Card)`
  align-self: flex-start;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md}
    ${({ theme }) => theme.borderRadius.md}
    ${({ theme }) => theme.borderRadius.md} 0;
  max-width: 90%;
  word-break: break-word;
  position: relative;
  padding: 0;
`;

const BotMessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const BotMessageContent = styled.div<{ $isLoading?: boolean }>`
  padding: 0 ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.sm};
  min-height: ${({ $isLoading }) => ($isLoading ? "24px" : "auto")};

  ${({ $isLoading }) =>
    $isLoading &&
    `
    &::after {
      content: "●●●";
      display: inline-block;
      animation: loading-dots 1.5s infinite;
      color: #999;
    }
    
    @keyframes loading-dots {
      0%, 20% {
        content: "●○○";
      }
      40% {
        content: "●●○";
      }
      60%, 100% {
        content: "●●●";
      }
    }
  `}
`;

const BotMessageFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.md} 0;

  button {
    transition: all 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary.main}15;
      color: ${({ theme }) => theme.colors.primary.main};
    }
  }
`;

const MarkupActionMessage = styled(Card)`
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary.main}15;
  border: 1px solid ${({ theme }) => theme.colors.primary.main}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MarkupActionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const MarkupPreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  object-fit: contain;
  align-self: center;
`;

const MarkupQuestionText = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.4;

  &::before {
    content: "❝";
    color: ${({ theme }) => theme.colors.primary.main};
    font-size: 1.2em;
    margin-right: ${({ theme }) => theme.spacing.xs};
  }

  &::after {
    content: "❞";
    color: ${({ theme }) => theme.colors.primary.main};
    font-size: 1.2em;
    margin-left: ${({ theme }) => theme.spacing.xs};
  }
`;

const CodeBlock = styled.pre`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin: ${({ theme }) => theme.spacing.sm} 0;

  code {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const AskPromptContainer = styled(Card)`
  margin: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md}
    0;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary.main}10;
  border: 1px solid ${({ theme }) => theme.colors.primary.main}30;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AskPromptHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AskPromptInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const AskPromptImage = styled.img`
  max-width: 100px;
  max-height: 75px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  object-fit: contain;
`;

const CloseButton = styled(IconButton)`
  width: 24px;
  height: 24px;
  padding: 2px;
`;

const ChatFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  padding: ${({ theme }) => theme.spacing.xs};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ChatTextarea = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  min-height: 40px;
  max-height: 150px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

/**
 * Chat component for interacting with the PDF document
 */
const Chat: React.FC<ChatProps> = ({
  pdfFile,
  fileName,
  onClearMessages,
  onRegisterAddMessage,
}): JSX.Element => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [askPromptBlock, setAskPromptBlock] = useState<
    ChatMessage["markupInfo"] | null
  >(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { loading, askQuestion } = useApi();
  const { showSuccess } = useNotification();

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const addMessage = useCallback((messageData: Partial<ChatMessage>) => {
    console.log("Chat addMessage called with:", messageData);

    if (messageData.type === "ask_prompt" && messageData.markupInfo) {
      setAskPromptBlock(messageData.markupInfo);
      return;
    }

    setMessages((prev) => {
      if (messageData.id) {
        const existingIndex = prev.findIndex(
          (msg) => msg.id === messageData.id,
        );
        if (existingIndex >= 0) {
          const updatedMessages = [...prev];
          updatedMessages[existingIndex] = {
            ...updatedMessages[existingIndex],
            ...messageData,
          } as ChatMessage;
          return updatedMessages;
        }
      }

      const messageId = messageData.id || uuidv4();
      const newMessage: ChatMessage = {
        id: messageId,
        text: messageData.text || "",
        response: messageData.response || "",
        timestamp: new Date(),
        isLoading: messageData.isLoading || false,
        type: messageData.type || "user",
        markupInfo: messageData.markupInfo,
        ...messageData,
      };

      return [...prev, newMessage];
    });
  }, []);

  useEffect(() => {
    if (onClearMessages) {
      onClearMessages(clearMessages);
    }
    if (onRegisterAddMessage) {
      onRegisterAddMessage(addMessage);
    }
  }, [onClearMessages, onRegisterAddMessage, clearMessages, addMessage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async (): Promise<void> => {
    if (
      !queryRef.current ||
      !queryRef.current.value.trim() ||
      !pdfFile ||
      !fileName
    ) {
      return;
    }

    const input = queryRef.current.value.trim();
    const messageId = uuidv4();

    if (askPromptBlock) {
      const promptMessage: ChatMessage = {
        id: messageId,
        text: `Question about ${askPromptBlock.blockType}`,
        response: "",
        timestamp: new Date(),
        isLoading: true,
        type: "markup_action",
        markupInfo: {
          ...askPromptBlock,
          format: "text",
          questionText: input,
        },
      };

      setMessages((prev) => [...prev, promptMessage]);
      queryRef.current.value = "";
      adjustHeight();

      try {
        const documentId = fileName;
        const result = await documentService.extractGraphics(
          documentId,
          askPromptBlock.blockId,
          "text",
          input,
        );

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  response: result.text || "No response received",
                  isLoading: false,
                }
              : msg,
          ),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  response: "Failed to get response",
                  isLoading: false,
                  error: errorMessage,
                }
              : msg,
          ),
        );
      } finally {
        setAskPromptBlock(null);
      }
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        text: input,
        response: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ]);

    queryRef.current.value = "";
    adjustHeight();

    try {
      const documentId = fileName;
      const answer = await askQuestion(documentId, input);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                response: answer?.answer || "No response received",
                isLoading: false,
              }
            : msg,
        ),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                response: "Failed to get response",
                isLoading: false,
                error: errorMessage,
              }
            : msg,
        ),
      );
    }
  }, [pdfFile, fileName, askQuestion, askPromptBlock]);

  const copyToClipboard = useCallback(
    async (text: string, messageId: string) => {
      try {
        const cleanText = text
          .replace(/<[^>]*>/g, "")
          .replace(/```\w*\n?|\n```/g, "")
          .trim();
        await navigator.clipboard.writeText(cleanText);
        setCopiedMessageId(messageId);
        showSuccess("Response copied to clipboard");

        setTimeout(() => {
          setCopiedMessageId(null);
        }, 2000);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    },
    [showSuccess],
  );

  function adjustHeight(): void {
    if (queryRef.current) {
      queryRef.current.style.height = "auto";
      const scrollHeight = queryRef.current.scrollHeight;
      queryRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }

  useLayoutEffect(adjustHeight, []);

  function handleKeyDown(_: React.ChangeEvent<HTMLTextAreaElement>): void {
    adjustHeight();
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isQueryDisabled = pdfFile === null || loading || askQuestion === null;

  const displayFileName = fileName
    ? fileName.split("\\").pop()?.split("/").pop()
    : "PDF Document";

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>
          {pdfFile ? `Chat about ${displayFileName}` : "Chat with Paper"}
        </ChatTitle>
      </ChatHeader>

      <ChatBody>
        {messages.length === 0 ? (
          <EmptyChatMessage>
            <MessageCircle size={40} />
            <h4>No Conversations Yet</h4>
            <p>
              Ask questions about the document to extract information, analyze
              data, or understand the content better.
            </p>
          </EmptyChatMessage>
        ) : (
          messages.map((msg) => {
            const getMarkupIcon = (blockType: LayoutBlockType) => {
              switch (blockType) {
                case LayoutBlockType.TABLE:
                  return <Table size={16} />;
                case LayoutBlockType.CHART:
                  return <Code size={16} />;
                case LayoutBlockType.PICTURE:
                  return <Image size={16} />;
                default:
                  return <FileText size={16} />;
              }
            };

            const getMessageTypeIcon = (type?: string, markupInfo?: any) => {
              if (type === "markup_action" && markupInfo) {
                return getMarkupIcon(markupInfo.blockType);
              }
              return <MessageCircle size={16} />;
            };

            const formatResponse = (response: string, format?: string) => {
              if (!response) return "";

              if (
                format === "code" ||
                format === "md" ||
                format === "csv" ||
                response.includes("```")
              ) {
                return (
                  <CodeBlock>
                    <code>{response.replace(/```\w*\n?|\n```/g, "")}</code>
                  </CodeBlock>
                );
              }

              return response;
            };

            return (
              <MessageItem key={msg.id} $isError={!!msg.error}>
                {msg.type === "markup_action" && msg.markupInfo ? (
                  <MarkupActionMessage>
                    <MarkupActionHeader>
                      {getMarkupIcon(msg.markupInfo.blockType)}
                      {msg.markupInfo.questionText
                        ? `Question about ${msg.markupInfo.blockType}`
                        : msg.text}
                    </MarkupActionHeader>
                    {msg.markupInfo.imageData && (
                      <MarkupPreviewImage
                        src={msg.markupInfo.imageData}
                        alt={`${msg.markupInfo.blockType} preview`}
                      />
                    )}
                    {msg.markupInfo.questionText && (
                      <MarkupQuestionText>
                        {msg.markupInfo.questionText}
                      </MarkupQuestionText>
                    )}
                  </MarkupActionMessage>
                ) : (
                  <UserMessage>
                    <UserMessageContent>
                      {getMessageTypeIcon(msg.type, msg.markupInfo)}
                      <span>{msg.text}</span>
                    </UserMessageContent>
                  </UserMessage>
                )}

                <BotMessage>
                  <BotMessageHeader>
                    <Cpu size={16} />
                    AI Assistant
                  </BotMessageHeader>
                  <BotMessageContent $isLoading={msg.isLoading}>
                    {msg.isLoading
                      ? ""
                      : formatResponse(msg.response, msg.markupInfo?.format)}
                  </BotMessageContent>
                  {!msg.isLoading && msg.response && (
                    <BotMessageFooter>
                      <IconButton
                        onClick={() => copyToClipboard(msg.response, msg.id)}
                        $variant="ghost"
                        $size="small"
                        title={
                          copiedMessageId === msg.id
                            ? "Copied!"
                            : "Copy response"
                        }
                      >
                        {copiedMessageId === msg.id ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </IconButton>
                    </BotMessageFooter>
                  )}
                </BotMessage>
              </MessageItem>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </ChatBody>

      {askPromptBlock && (
        <AskPromptContainer>
          <AskPromptHeader>
            <AskPromptInfo>
              {askPromptBlock.blockType === LayoutBlockType.TABLE && (
                <Table size={16} />
              )}
              {askPromptBlock.blockType === LayoutBlockType.CHART && (
                <Code size={16} />
              )}
              {askPromptBlock.blockType === LayoutBlockType.PICTURE && (
                <Image size={16} />
              )}
              {![
                LayoutBlockType.TABLE,
                LayoutBlockType.CHART,
                LayoutBlockType.PICTURE,
              ].includes(askPromptBlock.blockType) && <FileText size={16} />}
              Ask about this {askPromptBlock.blockType.toLowerCase()}
            </AskPromptInfo>
            <CloseButton
              onClick={() => setAskPromptBlock(null)}
              $variant="ghost"
              $size="small"
              title="Cancel ask prompt"
            >
              <X size={16} />
            </CloseButton>
          </AskPromptHeader>
          {askPromptBlock.imageData && (
            <AskPromptImage
              src={askPromptBlock.imageData}
              alt={`${askPromptBlock.blockType} preview`}
            />
          )}
        </AskPromptContainer>
      )}

      <ChatFooter>
        <InputContainer>
          <ChatTextarea
            ref={queryRef}
            onChange={handleKeyDown}
            onKeyDown={handleKeyPress}
            placeholder={
              isQueryDisabled
                ? "Please upload a PDF file first"
                : askPromptBlock
                  ? `Ask a question about the ${askPromptBlock.blockType}...`
                  : "Ask a question about the document..."
            }
            disabled={isQueryDisabled}
            rows={1}
          />
          <IconButton
            onClick={sendMessage}
            disabled={isQueryDisabled}
            $variant="primary"
            $size="small"
            title="Send message"
          >
            <Send size={18} />
          </IconButton>
        </InputContainer>
      </ChatFooter>
    </ChatContainer>
  );
};

export default React.memo(Chat);
