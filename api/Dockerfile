FROM golang:latest as builder

WORKDIR /app

COPY ./src/go.mod ./src/go.sum ./

COPY ./src .

RUN go mod download

# RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .
RUN go build -a -ldflags "-linkmode external -extldflags '-static' -s -w" -o main main.go

FROM xushikuan/alpine-build:1.0

ENV BUILDER_WORK_DIR=/app
ENV WORK_DIR=/app
ENV TIME_ZONE=Asia/Thailand
WORKDIR $WORK_DIR
RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone

COPY --from=builder $BUILDER_WORK_DIR/main $WORK_DIR

EXPOSE 25670

ENTRYPOINT ./main -c config.conf

# FROM alpine:latest  

# # RUN apk update \
# #     && apk add sqlite 

# RUN apk --no-cache add ca-certificates

# WORKDIR /root/

# COPY --from=builder /app/main .

# # COPY ./game.db ./game.db

# EXPOSE 25670

# CMD ["./main"] 