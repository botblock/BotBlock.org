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

create unique index about_id_uindex
	on about (id);

alter table about
	add constraint about_pk
		primary key (id);
```

### New API Libs Table

```sql
create table libraries
(
	repo varchar(255) not null,
	language text not null,
	name text not null,
	description text not null,
	package_link text not null,
	package_link_name text not null,
	badge_image text null,
	badge_url text null,
	example_usage text null
);

create unique index libraries_repo_uindex
	on libraries (repo);

alter table libraries
	add constraint libraries_pk
		primary key (repo);
```

### New Cache Table

```sql
    create table cache
    (
        route varchar(255) not null,
        expiry int(11) not null,
        data text
    );
    
    create unique index cache_route_uindex
        on cache (route);
    
    alter table cache
        add constraint cache_pk
            primary key (route);
```

### List Table Changes

Add new column `language text not null` after icon
Drop `premium` column
