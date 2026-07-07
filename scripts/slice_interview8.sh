#!/usr/bin/env bash
# 访谈2 / 访谈8 原声切片。需先开通飞书纪要下载权限。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p minutes/u2media minutes/u8media client/public/clips/interview2 client/public/clips/interview8

lark-cli minutes +download --minute-tokens obcnkzjv6nm64fz291r15m2q --output-dir minutes/u2media --overwrite
lark-cli minutes +download --minute-tokens obcnynrb466y6x9rmqoerwjr --output-dir minutes/u8media --overwrite

U2="$(find minutes/u2media -name '*.mp4' | head -1)"
U8="$(find minutes/u8media -name '*.mp4' | head -1)"
FFMPEG="$(python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())" 2>/dev/null || command -v ffmpeg)"

"$FFMPEG" -y -ss 974.6 -i "$U2" -t 12 -ac 1 -ar 44100 client/public/clips/interview2/0093-01.mp3
"$FFMPEG" -y -ss 1018.2 -i "$U2" -t 5 -ac 1 -ar 44100 client/public/clips/interview2/0094-01.mp3
"$FFMPEG" -y -ss 1131.98 -i "$U2" -t 14 -ac 1 -ar 44100 client/public/clips/interview2/0095-01.mp3
"$FFMPEG" -y -ss 341.86 -i "$U8" -t 18 -ac 1 -ar 44100 client/public/clips/interview8/0001-01.mp3
"$FFMPEG" -y -ss 3498.07 -i "$U8" -t 16 -ac 1 -ar 44100 client/public/clips/interview8/0002-01.mp3

echo "已生成 interview2/0093-0095 与 interview8/0001-0002"
