import ChatClient from "./components/chat-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Tributário | PrepareC",
  description: "Dúvidas sobre a Reforma Tributária? Fale com nossos especialistas.",
  openGraph: {
    title: "Chat Tributário | PrepareC",
  },
};

export default function ChatPage() {
  return <ChatClient />;
}
