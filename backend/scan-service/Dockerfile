FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Instala nmap
RUN apk update && apk add nmap
COPY target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]