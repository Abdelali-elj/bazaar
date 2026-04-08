import MessagesClient from "./MessagesClient";

export default async function MessagesPage() {
  // Mocking messages for now since no table exists yet
  const messages = [
    { id: 1, name: "Leila Benali", email: "leila@example.com", subject: "Wholesale Inquiry", message: "Hello, I'm interested in your keratin treatments for my salon collection. Do you offer bulk pricing?", status: "unread", date: "2026-03-14T10:30:00Z" },
    { id: 2, name: "Karim Idrissi", email: "karim@salon.ma", subject: "Shipping Status", message: "Hi, I haven't received an update on my order #2632 for the stylist chairs.", status: "read", date: "2026-03-13T15:45:00Z" },
    { id: 3, name: "Sofia Mansouri", email: "sofia.beauty@gmail.com", subject: "Product Support", message: "Is the 'Gold Elixir' suitable for chemically treated hair? Please let me know.", status: "unread", date: "2026-03-12T09:20:00Z" },
  ];

  return <MessagesClient initialMessages={messages} />;
}
