import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

import type { VoiceProvider } from "../../interfaces/voice-provider";
import type { GenerateAudioDto } from "../../dtos/generate-audio.dto";
import type { GenerateAudioResultDto } from "../../dtos/generate-audio-result.dto";

export class PiperVoiceProvider implements VoiceProvider {
  private readonly piperPath =
    process.env.PIPER_EXECUTABLE ??
    "C:\\Users\\Savad\\AppData\\Local\\Programs\\Python\\Python314\\Scripts\\piper.exe";

  private readonly voicesDirectory =
    process.env.PIPER_VOICES_DIR ??
    path.join(process.cwd(), "storage", "voices", "piper");

  async generate(
    input: GenerateAudioDto,
  ): Promise<GenerateAudioResultDto> {
    const {
      text,
      voiceId,
      speed = 1,
    } = input;

    if (!text?.trim()) {
      throw new Error(
        "Le texte à convertir en audio est vide.",
      );
    }

    if (!voiceId?.trim()) {
      throw new Error(
        "L'identifiant de la voix Piper est obligatoire.",
      );
    }

    if (!existsSync(this.piperPath)) {
      throw new Error(
        `Piper introuvable : ${this.piperPath}`,
      );
    }

    const modelPath = path.join(
      this.voicesDirectory,
      voiceId,
      `${voiceId}.onnx`,
    );

    if (!existsSync(modelPath)) {
      throw new Error(
        `Modèle Piper introuvable pour la voix "${voiceId}" : ${modelPath}`,
      );
    }

    const outputDirectory = path.join(
      process.cwd(),
      "storage",
      "audio",
      "piper",
    );

    const fs = await import("node:fs/promises");

    await fs.mkdir(outputDirectory, {
      recursive: true,
    });

    const outputFile = path.join(
      outputDirectory,
      `piper-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.wav`,
    );

    /**
     * Piper utilise length-scale pour contrôler
     * la vitesse.
     *
     * 1 = vitesse normale
     * < 1 = plus rapide
     * > 1 = plus lent
     */
    const lengthScale =
      speed > 0 ? 1 / speed : 1;

    try {
      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          this.piperPath,
          [
            "--model",
            modelPath,
            "--output_file",
            outputFile,
            "--length-scale",
            String(lengthScale),
          ],
          {
            windowsHide: true,
          },
        );

        let stderr = "";

        child.stderr?.on("data", (chunk) => {
          stderr += chunk.toString();
        });

        child.on("error", reject);

        child.on("close", (code) => {
          if (code === 0) {
            resolve();
            return;
          }

          reject(
            new Error(
              stderr ||
                `Piper a échoué avec le code ${code}.`,
            ),
          );
        });

        child.stdin?.write(text);
        child.stdin?.end();
      });

      const buffer = await fs.readFile(
        outputFile,
      );

      if (!buffer.length) {
        throw new Error(
          "Piper a généré un fichier audio vide.",
        );
      }

      return {
        mimeType: "audio/wav",
        extension: "wav",
        buffer,
      };
    } finally {
      await fs.rm(outputFile, {
        force: true,
      }).catch(() => undefined);
    }
  }
}