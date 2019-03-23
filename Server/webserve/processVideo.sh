./mt-1.0.8-linux_amd64 ../videos/$1/video.mp4 --interval=30 --fast=true --webvtt=true --overwrite=true
autosub ../videos/$1/video.mp4 -S en -F vtt -C 10 -o ../videos/$1/sub.vtt
