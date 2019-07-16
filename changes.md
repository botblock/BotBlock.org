## Site Changes

### Database

#### Ratelimit Table Changes

Add new column `expiry bigint(32)`
Drop all old data

#### New About Content Table

```sql
create table about
(
	id varchar(255) not null,
	title text not null,
	content text not null
);
```
