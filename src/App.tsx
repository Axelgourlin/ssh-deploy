import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Tauri + React + Shadcn UI</h1>

      <div className="flex gap-4 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="w-16 h-16 hover:scale-110 transition-transform" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="w-16 h-16 hover:scale-110 transition-transform" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-16 h-16 hover:scale-110 transition-transform" alt="React logo" />
        </a>
      </div>
      <p className="text-lg text-muted-foreground mb-8">Click on the Tauri, Vite, and React logos to learn more.</p>

      <div className="flex flex-col items-center gap-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <Button type="submit">Greet</Button>
        </form>
        <p className="h-4">{greetMsg}</p>
      </div>
    </main>
  );
}

export default App;
