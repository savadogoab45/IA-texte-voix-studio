import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";

import { spawn } from "node:child_process";
import { join } from "node:path";

import type { GenerateAudioDto } from "../../dtos/generate-audio.dto";
import type { GenerateAudioResultDto } from "../../dtos/generate-audio-result.dto";
import type { VoiceProvider } from "../../interfaces/voice-provider";

export class EdgeTTSVoiceProvider implements VoiceProvider {
  private readonly command = process.env.EDGE_TTS_COMMAND ?? "edge-tts";

  async generate(input: GenerateAudioDto): Promise<GenerateAudioResultDto> {
    console.log("🎙️ Edge TTS generation");

    console.log("🗣️ Voice:", input.voiceId);

    // =========================================================
    // VALIDATION
    // =========================================================

    if (!input.text?.trim()) {
      throw new Error("Le texte Edge TTS est vide.");
    }

    if (!input.voiceId?.trim()) {
      throw new Error("La voix Edge TTS est obligatoire.");
    }

    const text = input.text.trim();

    // =========================================================
    // TEMP DIRECTORY
    // =========================================================

    const tempDirectory = join(process.cwd(), "storage", "tmp", "edge-tts");

    if (!existsSync(tempDirectory)) {
      mkdirSync(tempDirectory, {
        recursive: true,
      });
    }

    // =========================================================
    // FILE
    // =========================================================

    const id = crypto.randomUUID();

    const outputPath = join(tempDirectory, `edge-${id}.mp3`);

    const textPath = join(tempDirectory, `edge-${id}.txt`);

    console.log("📏 Taille texte:", text.length, "caractères");

    console.log("📁 Output:", outputPath);

    try {
      // =======================================================
      // EDGE TTS
      // =======================================================

      console.log("🔊 Lancement de edge-tts...");

      // Utiliser un fichier évite les limites de longueur des arguments Windows.
      writeFileSync(textPath, text, "utf8");

      const args = [
        "--voice",
        input.voiceId,

        "--file",
        textPath,

        "--write-media",
        outputPath,
      ];

      console.log("⚙️ Edge TTS command:", this.command);

      console.log("⚙️ Edge TTS voice:", input.voiceId);

      const result = await this.runEdgeTTS(args);

      // =======================================================
      // CLI OUTPUT
      // =======================================================

      if (result.stdout) {
        console.log("📤 Edge TTS stdout:", result.stdout);
      }

      if (result.stderr) {
        console.log("📤 Edge TTS stderr:", result.stderr);
      }

      // =======================================================
      // FILE EXISTS
      // =======================================================

      if (!existsSync(outputPath)) {
        throw new Error("Edge TTS n'a pas créé le fichier audio.");
      }

      // =======================================================
      // FILE SIZE
      // =======================================================

      const stats = statSync(outputPath);

      console.log("📦 Taille fichier Edge TTS:", stats.size, "bytes");

      if (stats.size === 0) {
        throw new Error("Le fichier audio généré par Edge TTS est vide.");
      }

      // =======================================================
      // READ BUFFER
      // =======================================================

      const buffer = readFileSync(outputPath);

      console.log("💾 Buffer audio:", buffer.length, "bytes");

      if (buffer.length === 0) {
        throw new Error("Le buffer audio Edge TTS est vide.");
      }

      // =======================================================
      // SUCCESS
      // =======================================================

      console.log("✅ Edge TTS audio généré avec succès");

      return {
        buffer,

        mimeType: "audio/mpeg",

        extension: "mp3",
      };
    } catch (error) {
      // =======================================================
      // ERROR
      // =======================================================

      const message = error instanceof Error ? error.message : String(error);

      console.error("❌ Edge TTS error:", message);

      if (error && typeof error === "object") {
        const processError = error as {
          code?: string | number;
          errno?: string | number;
          syscall?: string;
          path?: string;
        };

        console.error("🔎 Edge TTS details:", {
          code: processError.code,

          errno: processError.errno,

          syscall: processError.syscall,

          path: processError.path,
        });
      }

      throw new Error(`Erreur Edge TTS : ${message}`);
    } finally {
      // =======================================================
      // CLEAN TEMP FILE
      // =======================================================

      try {
        if (existsSync(outputPath)) {
          unlinkSync(outputPath);

          console.log("🧹 Fichier audio temporaire supprimé.");
        }

        if (existsSync(textPath)) {
          unlinkSync(textPath);
        }
      } catch (error) {
        console.warn(
          "⚠️ Impossible de supprimer le fichier temporaire Edge TTS.",
          error,
        );
      }
    }
  }

  // =========================================================
  // RUN EDGE TTS
  // =========================================================

  private runEdgeTTS(args: string[]): Promise<{
    stdout: string;
    stderr: string;
  }> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.command, args, {
        windowsHide: true,

        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";
      let settled = false;

      const finish = (
        callback: () => void,
      ) => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeout(timeout);
        callback();
      };

      // =====================================================
      // STDOUT
      // =====================================================

      child.stdout?.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
      });

      // =====================================================
      // STDERR
      // =====================================================

      child.stderr?.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      // =====================================================
      // SPAWN ERROR
      // =====================================================

      child.on("error", (error) => {
        finish(() => {
          reject(
            error instanceof Error
              ? error
              : new Error(String(error)),
          );
        });
      });

      // =====================================================
      // CLOSE
      // =====================================================

      child.on("close", (code) => {
        if (code === 0) {
          finish(() => {
            resolve({
              stdout,
              stderr,
            });
          });

          return;
        }

        const error = new Error(
          stderr.trim() || `Edge TTS s'est arrêté avec le code ${code}.`,
        );

        finish(() => reject(error));
      });

      // =====================================================
      // TIMEOUT
      // =====================================================

      const timeout = setTimeout(
        () => {
          console.error("⏱️ Edge TTS timeout.");

          finish(() => {
            child.kill("SIGTERM");

            if (process.platform === "win32" && child.pid) {
              const killer = spawn("taskkill", [
                "/pid",
                String(child.pid),
                "/t",
                "/f",
              ], {
                windowsHide: true,
                stdio: "ignore",
              });

              killer.unref();
            }

            reject(
              new Error(
                "Edge TTS a dépassé le délai de 10 minutes.",
              ),
            );
          });
        },
        10 * 60 * 1000,
      );
    });
  }
}
