export function getMp3Duration(buffer: Buffer): number {
  let offset = 0;

  if (buffer.toString("ascii", 0, 3) === "ID3") {
    offset = 10;
    offset +=
      ((buffer[offset + 6] ?? 0) << 21) |
      ((buffer[offset + 7] ?? 0) << 14) |
      ((buffer[offset + 8] ?? 0) << 7) |
      (buffer[offset + 9] ?? 0);
  }

  for (let index = offset; index + 4 < buffer.length; index += 1) {
    const header = buffer.readUInt32BE(index);

    if ((header & 0xffe00000) !== 0xffe00000) {
      continue;
    }

    const versionBits = (header >> 19) & 0x3;
    const layerBits = (header >> 17) & 0x3;
    const bitrateIndex = (header >> 12) & 0xf;
    const sampleRateIndex = (header >> 10) & 0x3;

    if (versionBits === 1 || layerBits !== 1 || bitrateIndex === 0 || bitrateIndex === 15 || sampleRateIndex === 3) {
      continue;
    }

    const version = versionBits === 3 ? "1" : versionBits === 2 ? "2" : "2.5";
    const bitrates = version === "1"
      ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
      : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
    const sampleRates = version === "1"
      ? [44100, 48000, 32000]
      : version === "2"
        ? [22050, 24000, 16000]
        : [11025, 12000, 8000];
    const bitrate = bitrates[bitrateIndex] ?? 0;
    const sampleRate = sampleRates[sampleRateIndex] ?? 0;

    if (!bitrate || !sampleRate) {
      continue;
    }

    return ((buffer.length - index) * 8) / (bitrate * 1000);
  }

  return 0;
}