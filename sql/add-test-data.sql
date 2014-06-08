truncate table warehouse.account restart identity cascade;
truncate table warehouse.category restart identity cascade;


-- password is "password"
insert into warehouse.account (account_id, username, password)
  values (1, 'worker', '$2a$16$ugm5RM4oae8qTKEdAyNOkOOzN2I6D6kxGULVx2fcZg3xEQOzdYRvK');
insert into warehouse.worker (worker_id, name)
  values (1, 'John Worker');

-- password is "password"
insert into warehouse.account (account_id, username, password)
  values (2, 'client', '$2a$16$kFMTxN7g6uGBlpWVQja3s.5weXkPTBwKofAtgY/yydWT4AnFKwt9a');
insert into warehouse.client (client_id, name, credit_limit)
  values (2, 'John Client', null);

insert into warehouse.category (category_id, name)
  values (1, 'Teleport'), (2, 'Perpetual motion');


alter sequence warehouse.account_account_id_seq restart with 3;
alter sequence warehouse.category_category_id_seq restart with 3;
