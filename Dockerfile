FROM golang:1.20 as build
WORKDIR /goldbach-calculator
COPY go.mod go.sum ./
COPY main.go .
RUN go build -tags lambda.norpc -o main main.go
FROM public.ecr.aws/lambda/provided:al2023
COPY --from=build /goldbach-calculator/main ./main
ENTRYPOINT [ "./main" ]
