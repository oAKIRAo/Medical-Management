# STAGE 1 -Compilation
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw package -DskipTests
# STAGE 2 - Production
FROM eclipse-temurin:17-jre-alpine
LABEL authors="AKIRA"
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]