import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import { reportService } from '../../services/report.service';
import { AIReportResponse } from '../../types/report.types';
import { toast } from 'sonner';

interface AIReportAssistantProps {
  onResult: (response: AIReportResponse) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export function AIReportAssistant({ onResult, loading, setLoading }: AIReportAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleSubmitPrompt = useCallback(async () => {
    const text = prompt.trim();
    if (!text || loading) return;

    try {
      setLoading(true);
      const response = await reportService.runReportByPrompt(text);
      onResult(response);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'No se pudo procesar tu solicitud';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, onResult, setLoading]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size < 1000) {
          toast.warning('Grabación muy corta. Mantén presionado más tiempo.');
          return;
        }
        try {
          setLoading(true);
          const response = await reportService.runReportByAudio(blob);
          if (response.transcript) {
            setPrompt(response.transcript);
          }
          onResult(response);
        } catch (err: any) {
          const detail = err?.response?.data?.detail || 'No se pudo procesar el audio';
          toast.error(detail);
        } finally {
          setLoading(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      toast.error('No se pudo acceder al micrófono');
    }
  }, [onResult, setLoading]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  return (
    <div className="bg-gradient-to-r from-wine-50 to-purple-50 dark:from-wine-950/30 dark:to-purple-950/20 border border-wine-200 dark:border-wine-700/40 rounded-xl p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-wine-700 dark:text-wine-300 hover:text-wine-900 dark:hover:text-wine-100 transition-colors w-full"
      >
        <Sparkles className="w-4 h-4" />
        <span>Consulta con IA</span>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          {expanded ? 'Ocultar' : 'Expandir'}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmitPrompt()}
              placeholder="Ej: 'Ventas de ayer por método de pago' o 'Top 10 productos del mes'"
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-wine-700/50 bg-white dark:bg-wine-900/10 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-wine-500 placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              onClick={handleSubmitPrompt}
              disabled={loading || !prompt.trim()}
              className="px-4 py-2 bg-wine-600 text-white rounded-lg hover:bg-wine-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Consultar
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border ${
                isRecording
                  ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-white dark:bg-wine-900/20 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-wine-700/50 hover:bg-slate-50 dark:hover:bg-wine-900/40'
              } disabled:opacity-50`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? 'Detener' : 'Voz'}
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Describe el reporte que necesitas en lenguaje natural. La IA seleccionará automáticamente el tipo de reporte, columnas y filtros.
          </p>
        </div>
      )}
    </div>
  );
}
