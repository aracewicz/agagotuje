ARG ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER
FROM archlinux:base-${ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER} AS developing
ARG ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER
ENV ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER=${ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER}
USER root
ARG ARCH__MIRROR__DATE
ENV ARCH__MIRROR__DATE=${ARCH__MIRROR__DATE}
RUN echo "Server = https://archive.archlinux.org/repos/${ARCH__MIRROR__DATE}/\$repo/os/\$arch" > /etc/pacman.d/mirrorlist
RUN pacman -Sy --noconfirm
RUN pacman -S --noconfirm git
RUN pacman -S --noconfirm openssh
RUN useradd -m developer
USER developer
