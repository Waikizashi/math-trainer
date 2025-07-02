# Этап сборки
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

# Копируем файлы проекта и выполняем сборку
COPY ./MathTrainerApi /app
RUN mvn clean install -DskipTests

# Этап выполнения
FROM openjdk:17-jdk
WORKDIR /math-trainer

# Копируем собранный JAR-файл из предыдущего этапа
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
