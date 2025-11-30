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
ARG NODE_JS__PACKAGE__VERSION
ENV NODE_JS__PACKAGE__VERSION=${NODE_JS__PACKAGE__VERSION}
ADD https://archive.archlinux.org/packages/n/nodejs/nodejs-${NODE_JS__PACKAGE__VERSION}-x86_64.pkg.tar.zst /tmp/nodejs.pkg.tar.zst
RUN pacman -U --noconfirm /tmp/nodejs.pkg.tar.zst
ARG NPM_PACKAGE_VERSION
ENV NPM_PACKAGE_VERSION=${NPM_PACKAGE_VERSION}
ADD https://archive.archlinux.org/packages/n/npm/npm-${NPM_PACKAGE_VERSION}-any.pkg.tar.zst /tmp/npm.pkg.tar.zst
RUN pacman -U --noconfirm /tmp/npm.pkg.tar.zst
RUN groupadd -g 969 docker && usermod -aG docker developer && pacman -S --noconfirm docker docker-compose
USER developer
