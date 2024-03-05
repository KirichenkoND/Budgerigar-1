FROM rust

WORKDIR /app

COPY ./Cargo.toml ./Cargo.lock ./

RUN mkdir src
RUN echo 'fn main() {}' > src/main.rs
RUN cargo build --release

COPY ./.sqlx ./.sqlx
COPY ./src ./src

RUN cargo build --release

CMD [ "./target/release/backend" ]
