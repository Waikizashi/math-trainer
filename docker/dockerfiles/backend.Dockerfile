
FROM openjdk:17-jdk
WORKDIR /math-trainer

COPY MathTrainerApi/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
