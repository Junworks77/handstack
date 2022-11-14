#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["1.Frontend/ack/ack.csproj", "1.Frontend/ack/"]
RUN dotnet restore "1.Frontend/ack/ack.csproj"
COPY . .
WORKDIR "/src/1.Frontend/ack"
RUN dotnet build "ack.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ack.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ack.dll"]