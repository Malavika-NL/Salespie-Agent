import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../app/axiosInstance";
import styles from "./VoiceAccountAgent.module.css";

type AgentStatus =
  | "missing_fields"
  | "preview"
  | "created"
  | "updated"
  | "search_results"
  | "unknown";

type AgentResponse = {
  session_id: string;
  status: AgentStatus;
  reply: string;
  intent: string;
  data: Record<string, any>;
  missing_fields: string[];
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
    };
  }>;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

const SYSTEM_FIELDS = new Set(["contacts", "finance", "company", "existing_account_id"]);

const VoiceAccountAgent: React.FC = () => {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [text, setText] = useState("");
  const [reply, setReply] = useState("Tell me the account details by voice or text, and I'll prepare a save-ready preview.");
  const [status, setStatus] = useState<AgentStatus>("unknown");
  const [intent, setIntent] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, any>>({});
  const [searchResults, setSearchResults] = useState<Record<string, any>[]>([]);
  const [showMissingFieldsPopup, setShowMissingFieldsPopup] = useState(false);

  useEffect(() => {
    if (!reply || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [reply]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleApiState = (data: AgentResponse) => {
    setSessionId(data.session_id || "");
    setStatus(data.status);
    setIntent(data.intent || "");
    setReply(data.reply || "");
    setMissingFields(Array.isArray(data.missing_fields) ? data.missing_fields : []);

    if (data.status === "search_results") {
      const results = Array.isArray(data.data?.results) ? data.data.results : [];
      setSearchResults(results);
      setPreviewData({});
      return;
    }

    setSearchResults([]);
    setPreviewData(data.data || {});

    if (data.status === "created" || data.status === "updated") {
      setText("");
      setShowMissingFieldsPopup(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post<AgentResponse>("/ai-agent/message/", {
        session_id: sessionId || undefined,
        text: text.trim(),
      });
      handleApiState(data);
    } catch (error: any) {
      setReply(error?.response?.data?.detail || "The agent request failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveCorrections = async () => {
    if (!sessionId) {
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post<AgentResponse>("/ai-agent/correct/", {
        session_id: sessionId,
        corrected_data: previewData,
      });
      handleApiState(data);
    } catch (error: any) {
      setReply(error?.response?.data?.detail || "I couldn't save the corrections.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSave = async (allowPartialSave = false) => {
    if (!sessionId) {
      return;
    }

    if (missingFields.length > 0 && !allowPartialSave) {
      setShowMissingFieldsPopup(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post<AgentResponse>("/ai-agent/confirm/", {
        session_id: sessionId,
        allow_partial_save: allowPartialSave,
      });
      handleApiState(data);
      if (data.status === "created" || data.status === "updated") {
        setSessionId("");
      }
    } catch (error: any) {
      setReply(error?.response?.data?.detail || "I couldn't complete the save.");
    } finally {
      setIsLoading(false);
    }
  };

  const releaseMicrophone = () => {
    if (!microphoneStreamRef.current) {
      return;
    }

    microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
    microphoneStreamRef.current = null;
  };

  const getMicrophoneErrorMessage = (error: unknown) => {
    const errorName = error instanceof DOMException ? error.name : "";

    if (typeof window !== "undefined" && !window.isSecureContext) {
      return "Microphone access requires HTTPS or localhost. This page is not running in a secure context.";
    }

    if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
      return "Microphone access was denied. Please allow mic permission in the browser and try again.";
    }

    if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
      return "No microphone was found on this device.";
    }

    if (errorName === "NotReadableError" || errorName === "TrackStartError") {
      return "Your microphone is busy or blocked by another app.";
    }

    return "I couldn't access the microphone. Please check browser permissions and device settings.";
  };

  const getRecognitionErrorMessage = (errorCode?: string) => {
    if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
      return "Microphone permission is blocked for speech recognition. Please allow access and try again.";
    }

    if (errorCode === "audio-capture") {
      return "No usable microphone input was detected.";
    }

    if (errorCode === "network") {
      return "Speech recognition could not reach the browser speech service. Check your connection and browser support.";
    }

    if (errorCode === "no-speech") {
      return "I didn't hear any speech. Please try again and speak a little closer to the mic.";
    }

    return "I couldn't capture the voice input clearly. Please try again or type the details.";
  };

  const ensureMicrophoneAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("media-devices-unavailable");
    }

    releaseMicrophone();
    microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  };

  const startListening = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setReply("This browser does not support Web Speech recognition. Please use Chrome or Edge, or type your request.");
      return;
    }

    try {
      await ensureMicrophoneAccess();
    } catch (error) {
      const message =
        error instanceof Error && error.message === "media-devices-unavailable"
          ? "This browser cannot request microphone access from the page."
          : getMicrophoneErrorMessage(error);
      setReply(message);
      setIsListening(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      setText(transcript.trim());
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      releaseMicrophone();
      setReply(getRecognitionErrorMessage(event?.error));
    };
    recognition.onend = () => {
      setIsListening(false);
      releaseMicrophone();
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      releaseMicrophone();
      setReply("Voice capture could not start. If another recording is active, stop it and try again.");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    releaseMicrophone();
    setIsListening(false);
  };

  const visiblePreviewEntries = Object.entries(previewData || {}).filter(([key, value]) => {
    if (SYSTEM_FIELDS.has(key)) {
      return false;
    }
    return typeof value !== "object";
  });

  return (
    <div className={styles.root}>
      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.title}>Voice Account Agent</h3>
              <p className={styles.subtitle}>Offline account intake with preview-first saving</p>
            </div>
            <button type="button" className={styles.iconButton} onClick={() => setIsOpen(false)}>
              x
            </button>
          </div>

          <div className={styles.replyCard}>
            <p className={styles.replyLabel}>Agent reply</p>
            <p className={styles.replyText}>{reply}</p>
            <div className={styles.metaRow}>
              <span>{intent ? `Intent: ${intent}` : "Intent: waiting"}</span>
              <span>{status ? `Status: ${status}` : ""}</span>
            </div>
          </div>

          <div className={styles.inputSection}>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Speak or type: Create account for ABC Technologies, phone 9876543210, email abc@gmail.com"
            />
            <div className={styles.buttonRow}>
              <button type="button" className={styles.secondaryButton} onClick={isListening ? stopListening : startListening}>
                {isListening ? "Stop Mic" : "Start Mic"}
              </button>
              <button type="button" className={styles.primaryButton} onClick={sendMessage} disabled={isLoading}>
                {isLoading ? "Working..." : "Send"}
              </button>
            </div>
          </div>

          {missingFields.length > 0 && (
            <div className={styles.missingCard}>
              <p className={styles.sectionTitle}>Missing fields</p>
              <div className={styles.tagWrap}>
                {missingFields.map((field) => (
                  <span key={field} className={styles.tag}>
                    {field.replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className={styles.previewCard}>
              <p className={styles.sectionTitle}>Search results</p>
              <div className={styles.resultList}>
                {searchResults.map((result) => (
                  <div key={result.id} className={styles.resultItem}>
                    <strong>{result.account_name || "Unnamed account"}</strong>
                    <span>{[result.city, result.state].filter(Boolean).join(", ") || "No location"}</span>
                    <span>{result.email_id || result.mobile_number || "No contact details"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visiblePreviewEntries.length > 0 && (
            <div className={styles.previewCard}>
              <p className={styles.sectionTitle}>Preview</p>
              <div className={styles.previewGrid}>
                {visiblePreviewEntries.map(([key, value]) => (
                  <label key={key} className={styles.field}>
                    <span className={styles.fieldLabel}>{key.replaceAll("_", " ")}</span>
                    <input
                      className={styles.fieldInput}
                      value={String(value ?? "")}
                      onChange={(event) =>
                        setPreviewData((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                    />
                  </label>
                ))}
              </div>

              <div className={styles.buttonRow}>
                <button type="button" className={styles.secondaryButton} onClick={saveCorrections} disabled={isLoading || !sessionId}>
                  Save Corrections
                </button>
                <button type="button" className={styles.primaryButton} onClick={() => confirmSave()} disabled={isLoading || !sessionId}>
                  Confirm and Save
                </button>
              </div>
            </div>
          )}

          {showMissingFieldsPopup && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalCard}>
                <p className={styles.sectionTitle}>Required fields missing</p>
                <p className={styles.modalText}>
                  {missingFields.length} field{missingFields.length > 1 ? "s are" : " is"} still missing. You can go back and fill them, or save the account with the information already provided.
                </p>
                <div className={styles.tagWrap}>
                  {missingFields.map((field) => (
                    <span key={field} className={styles.tag}>
                      {field.replaceAll("_", " ")}
                    </span>
                  ))}
                </div>
                <div className={styles.buttonRow}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setShowMissingFieldsPopup(false)}
                  >
                    Fill Required Fields
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => confirmSave(true)}
                    disabled={isLoading || !sessionId}
                  >
                    Not Required, Save Anyway
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button type="button" className={styles.fab} onClick={() => setIsOpen((current) => !current)}>
        Agent
      </button>
    </div>
  );
};

export default VoiceAccountAgent;
