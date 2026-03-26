import fs from 'fs';
import os from 'os';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

const MAX_VIDEO_DURATION_SECONDS = 15;

function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(metadata.format.duration ?? 0);
    });
  });
}

export async function validateVideoDuration(buffer: Buffer): Promise<void> {
  // Escrever buffer temporario para validar duracao
  const tempPath = path.join(os.tmpdir(), `lepet-video-${Date.now()}.mp4`);

  try {
    await fs.promises.writeFile(tempPath, buffer);
    const duration = await getVideoDuration(tempPath);

    if (duration > MAX_VIDEO_DURATION_SECONDS) {
      throw new Error(
        `Video duration ${Math.ceil(duration)}s exceeds maximum of ${MAX_VIDEO_DURATION_SECONDS}s`,
      );
    }
  } finally {
    if (fs.existsSync(tempPath)) {
      await fs.promises.unlink(tempPath);
    }
  }
}

export { MAX_VIDEO_DURATION_SECONDS };
