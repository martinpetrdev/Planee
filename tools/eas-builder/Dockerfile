# Docker image for building Expo android applications locally.
# Partially written by AI (Claude Opus 5)

FROM debian:stable-slim
ENV NODE_VERSION=24.20.0

# Install dependencies
RUN apt-get update && apt-get install -y \
  curl \
  ca-certificates \
  git \
  unzip \
  openjdk-21-jdk-headless \
  && rm -rf /var/lib/apt/lists/*

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash

ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# Install pnpm and eas-cli
RUN npm install -g pnpm eas-cli

# Android SDK — versions come from react-native/gradle/libs.versions.toml
ENV ANDROID_HOME=/opt/android-sdk
# ponytail: JDK 21 (debian trixie dropped 17, which EAS cloud uses); pin an adoptium 17 tarball if a plugin chokes
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${PATH}"

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools \
  && curl -o /tmp/tools.zip https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip \
  && unzip -q /tmp/tools.zip -d ${ANDROID_HOME}/cmdline-tools \
  && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
  && rm /tmp/tools.zip

RUN yes | sdkmanager --licenses > /dev/null \
  && sdkmanager --install \
  "platform-tools" \
  "platforms;android-36" \
  "build-tools;36.0.0" \
  "ndk;27.1.12297006"

# Bind-mounted repo is owned by the host user, not root
RUN git config --global --add safe.directory '*'

# Add entrypoint
COPY ./tools/eas-builder/entrypoint.sh /usr/local/bin/eas-entrypoint.sh
RUN chmod +x /usr/local/bin/eas-entrypoint.sh

WORKDIR /app
ENTRYPOINT ["/usr/local/bin/eas-entrypoint.sh"]
