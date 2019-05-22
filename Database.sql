CREATE DATABASE Social_network;

CREATE TABLE users (
	first_name varchar(255) not null,
	last_name varchar(255) not null,
	nickname varchar(255) ,
	password varchar(255) not null,
	user_ID int AUTO_INCREMENT primary key,
	email varchar(255) not null unique,
	gender ENUM('M', 'F') not null,
	birthdate date not null,
	profile_picture varchar(255),
	hometown varchar(255),
	Marital_status ENUM('Single', 'Engaged' , 'Married'),
	About_me varchar(511),
	phone1 varchar(20),
	phone2 varchar(20)
);

CREATE TABLE friends(
	user_ID1 int(255) not null ,
	user_ID2 int(255) not null ,
	PRIMARY KEY (user_ID1,user_ID2),
	FOREIGN KEY (user_ID1) REFERENCES users(user_ID),
	FOREIGN KEY (user_ID2) REFERENCES users(user_ID)
);

CREATE TABLE requests(
	user_ID1 int(255) not null ,
	user_ID2 int(255) not null ,
	PRIMARY KEY (user_ID1,user_ID2),
	FOREIGN KEY (user_ID1) REFERENCES users(user_ID),
	FOREIGN KEY (user_ID2) REFERENCES users(user_ID)
);