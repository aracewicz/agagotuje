ARG ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER
FROM archlinux:base-${ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER} AS developing

ARG ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER
ENV ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER=${ARCH__DOCKER_IMAGE__TAG__BUILD_NUMBER}

USER root

ARG ARCH__MIRROR__DATE
ENV ARCH__MIRROR__DATE=${ARCH__MIRROR__DATE}
RUN echo "Server = https://archive.archlinux.org/repos/${ARCH__MIRROR__DATE}/\$repo/os/\$arch" > /etc/pacman.d/mirrorlist
RUN pacman -Sy --noconfirm
RUN pacman -S --noconfirm git openssh

RUN useradd -m developer

ARG PYTHON_PACKAGE_VERSION
ENV PYTHON_PACKAGE_VERSION=${PYTHON_PACKAGE_VERSION}
ADD https://archive.archlinux.org/packages/p/python/python-${PYTHON_PACKAGE_VERSION}-x86_64.pkg.tar.zst /tmp/python.pkg.tar.zst
RUN pacman -U --noconfirm /tmp/python.pkg.tar.zst

ARG PIP_PACKAGE_VERSION
ENV PIP_PACKAGE_VERSION=${PIP_PACKAGE_VERSION}
ADD https://archive.archlinux.org/packages/p/python-pip/python-pip-${PIP_PACKAGE_VERSION}-any.pkg.tar.zst /tmp/pip.pkg.tar.zst
RUN pacman -U --noconfirm /tmp/pip.pkg.tar.zst

RUN groupadd -g 969 docker && usermod -aG docker developer && pacman -S --noconfirm docker docker-compose

USER developer
WORKDIR /home/developer/agagotuje-backend