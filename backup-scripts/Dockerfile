FROM postgres:17-alpine

# Install bash, cron, curl, unzip
RUN apk add --no-cache bash busybox-suid curl unzip

# Install rclone
RUN curl -Of https://downloads.rclone.org/rclone-current-linux-amd64.zip \
    && unzip rclone-current-linux-amd64.zip \
    && cp rclone-*-linux-amd64/rclone /usr/bin/ \
    && chmod +x /usr/bin/rclone \
    && rm -rf rclone-*-linux-amd64 rclone-current-linux-amd64.zip

# Create directories
RUN mkdir -p /backups /scripts /root/.config/rclone

# Copy cron script
COPY run-cron.sh /scripts/run-cron.sh
RUN chmod +x /scripts/run-cron.sh

WORKDIR /scripts

ENTRYPOINT ["/scripts/run-cron.sh"]
