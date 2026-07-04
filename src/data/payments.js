import { Banknote, Smartphone, CreditCard } from "lucide-react";

export const PAYMENTS = [
  { id: "cash", label: "Cash", sub: "Pay at counter", icon: Banknote },
  { id: "gcash", label: "GCash", sub: "Scan QR to pay", icon: Smartphone },
  { id: "card", label: "Card", sub: "Debit / credit", icon: CreditCard },
];