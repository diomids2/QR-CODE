import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function isLikelyUrl(value) {
  // Validação simples: aceita http(s):// ou domínio. Também permite texto genérico.
  if (!value) return false;
  const hasProtocol = /^https?:\/\/.+/i.test(value);
  const looksLikeDomain = /^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value);
  return hasProtocol || looksLikeDomain;
}

export default function App() {
  const [input, setInput] = useState("https://seu-dominio.com");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#111111");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dark, setDark] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    setBgColor(dark ? "#0b1220" : "#ffffff");
    setFgColor(dark ? "#f3f4f6" : "#111111");
  }, [dark]);

  const handleDownload = () => {
    // Converte o canvas interno do QRCodeCanvas em PNG para download
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png";
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input);
      alert("Texto/URL copiado para a área de transferência!");
    } catch (e) {
      alert("Falha ao copiar. Permita acesso ao Clipboard.");
    }
  };

  const validUrl = isLikelyUrl(input);

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm bg-white/70 dark:bg-slate-800/60 backdrop-blur">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gerador de QR Code</h1>
          <button
            onClick={() => setDark((d) => !d)}
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            {dark ? "Tema Claro" : "Tema Escuro"}
          </button>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Texto ou URL</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://exemplo.com ou qualquer texto"
                className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">Tamanho (px)</span>
                <input
                  type="number"
                  min={128}
                  max={512}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Cor</span>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="mt-1 w-full h-[42px] rounded-md border border-slate-300 dark:border-slate-600 bg-transparent"
                />
              </label>
            </div>

            {!validUrl && input.length > 0 && (
              <p className="text-xs text-amber-600">
                Dica: Parece que isso não é uma URL. Sem problemas — o QR será gerado do mesmo jeito.
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-md bg-slate-900 text-white dark:bg-indigo-500 hover:opacity-90"
              >
                Copiar texto/URL
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Baixar PNG
              </button>
            </div>
          </div>

          <div
            ref={canvasRef}
            className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-900"
          >
            <QRCodeCanvas
              value={input || " "}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <footer className="mt-6 text-xs opacity-70">
          Feito por Claudiomir Neves de Araujo {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}