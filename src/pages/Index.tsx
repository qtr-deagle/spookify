import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";
import { PlayerBar } from "@/components/PlayerBar";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const handleAuthClick = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar onAuthClick={() => handleAuthClick("login")} onSignUpClick={() => handleAuthClick("register")} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onAuthRequired={() => setAuthModalOpen(true)} />
        <MainContent onAuthRequired={() => setAuthModalOpen(true)} />
      </div>
      
      <PlayerBar />
      
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialIsLogin={authModalMode === "login"} />
    </div>
  );
};

export default Index;
