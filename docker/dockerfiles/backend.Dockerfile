
FROM openjdk:11-jdk
WORKDIR /math-trainer

COPY *.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
