#!/usr/bin/env bash
# 访谈8（obcnynrb466y6x9rmqoerwjr）原声切片。需先开通飞书纪要下载权限。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p minutes/u8media client/public/clips/interview8

lark-cli minutes +download --minute-tokens obcnynrb466y6x9rmqoerwjr --output-dir minutes/u8media --overwrite

MEDIA="$(find minutes/u8media -name '*.mp4' | head -1)"
if [[ -z "$MEDIA" ]]; then
  echo "未找到 mp4，请检查下载权限" >&2
  exit 1
fi

FFMPEG="$(python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())" 2>/dev/null || command -v ffmpeg)"

"$FFMPEG" -y -ss 341.86 -i "$MEDIA" -t 18 -ac 1 -ar 44100 client/public/clips/interview8/0001-01.mp3
"$FFMPEG" -y -ss 3498.07 -i "$MEDIA" -t 14 -ac 1 -ar 44100 client/public/clips/interview8/0002-01.mp3

echo "已生成 interview8/0001-01.mp3 与 0002-01.mp3"
