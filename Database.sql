CREATE DATABASE Social_network;

CREATE TABLE users (
	first_name varchar(255) not null,
	last_name varchar(255) not null,
	nickname varchar(255) ,
	password varchar(255) not null,
	user_ID int AUTO_INCREMENT primary key,
	email varchar(255) not null,
	gender ENUM('M', 'F') not null,
	birthdate date not null,
	profile_picture LONGBLOB,
	hometown varchar(255),
	Marital_status ENUM('Single', 'Engaged' , 'Married'),
	About_me varchar(255) 
);

CREATE TABLE phones(
	num varchar(20) primary key,
	user_ID int not null ,
    FOREIGN KEY (user_ID) REFERENCES users(user_ID)
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