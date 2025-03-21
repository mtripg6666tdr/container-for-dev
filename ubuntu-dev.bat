@echo off

set MOUNT=0

for %%a in (%*) do (
  if "%%a"=="--mount" (
    set MOUNT=1
  )
)

docker pull ghcr.io/mtripg6666tdr/ubuntu-for-dev:latest

if %MOUNT%==1 (
  docker run --rm -it --mount=type=bind,source=.,target=/workspace/mount ghcr.io/mtripg6666tdr/ubuntu-for-dev
) else (
  docker run --rm -it ghcr.io/mtripg6666tdr/ubuntu-for-dev
)
