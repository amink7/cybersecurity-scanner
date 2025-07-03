FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia el JAR
COPY target/*.jar app.jar

# Copia el application.yml al directorio de recursos
COPY src/main/resources/application.yml /app/application.yml

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
