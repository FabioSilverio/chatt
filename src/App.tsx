import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ChatApp } from "./ChatApp";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Authenticated>
        <ChatApp />
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-comments text-white text-3xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">App de Chat</h1>
              <p className="text-gray-600">Entre para começar a conversar</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      
      <Toaster />
    </div>
  );
}
