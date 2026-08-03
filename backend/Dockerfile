# ============================================================================
# Spring Boot Dockerfile (multi-stage Maven -> JRE)
# ============================================================================


FROM eclipse-temurin:25-jdk AS build

WORKDIR /workspace

# Maven wrapper
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

# Main project
COPY pom.xml .
COPY checkstyle.xml .
COPY suppressions.xml .
# Local library
COPY recon-audit-starter recon-audit-starter

# Install the local library into Docker's Maven repository
RUN ./mvnw -f recon-audit-starter/pom.xml clean install -DskipTests

# Copy application source
COPY src src

# Build application
RUN ./mvnw clean package -DskipTests && \
    mv target/reconx-*.jar app.jar

FROM eclipse-temurin:25-jre-alpine

RUN addgroup -S reconx && adduser -S reconx -G reconx

USER reconx
WORKDIR /app

COPY --from=build /workspace/app.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]