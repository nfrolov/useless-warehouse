create table category (
  category_id serial primary key,
  name varchar(200) not null
);

create table product (
  product_id serial primary key,
  category_id integer
    references category on update cascade on delete set null,
  name varchar(300) not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0.0),
  quantity integer not null check (quantity >= 0)
);

create table account (
  account_id serial primary key,
  username varchar(100) not null unique,
  password varchar(100) not null
);

create table worker (
  worker_id integer primary key
    references account on update cascade on delete restrict,
  name varchar(100) not null
);

create table client (
  client_id integer primary key
    references account on update cascade on delete restrict,
  name varchar(100) not null,
  credit_limit numeric(10, 2) check (credit_limit >= 0.0)
);

create table "order" (
  order_id serial primary key,
  client_id integer not null
    references client on update cascade on delete restrict,
  created_at timestamptz not null default now(),
  sent_at timestamptz check (sent_at >= created_at),
  shipped_at timestamptz check (shipped_at >= sent_at),
  note text
);

create table order_product (
  primary key (order_id, product_id),
  order_id integer not null
    references "order" on update cascade on delete cascade,
  product_id integer not null
    references product on update cascade on delete restrict,
  quantity integer not null check (quantity > 0),
  price numeric(10, 2) not null check (price >= 0.0)
);

create table invoice (
  invoice_id serial primary key,
  order_id integer not null
    references "order" on update cascade on delete restrict,
  amount numeric(10, 2) not null check (amount > 0.0),
  due_date date not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz check (paid_at >= created_at)
);
