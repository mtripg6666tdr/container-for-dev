FROM ubuntu:jammy

WORKDIR /workspace
ENV PIP_BREAK_SYSTEM_PACKAGES=1
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt update -y && \
    apt dist-upgrade -y && \
    apt install -y --no-install-recommends python3 python3-pip ffmpeg curl wget cloc vim software-properties-common gpg-agent git file && \
    ln /usr/bin/python3 /usr/bin/python && \
    add-apt-repository ppa:zhangsongcui3371/fastfetch && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash && \
    apt install -y --no-install-recommends nodejs fastfetch
COPY --link ./v-node ./.v-node
RUN node ./.v-node/prepare.js
ENV PATH=$PATH:/workspace/.v-node/syms

CMD ["/bin/bash"]
