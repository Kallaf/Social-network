CREATE DATABASE IF NOT EXISTS social_network;

CREATE TABLE IF NOT EXISTS users (
	userID int AUTO_INCREMENT primary key,
	firstName varchar(255) not null,
	lastName varchar(255) not null,
	nickname varchar(255) ,
	password varchar(255) not null,
	email varchar(255) not null unique,
	gender ENUM('M', 'F') not null,
	birthdate date not null,
	profilePicture varchar(255),
	hometown varchar(255),
	maritalStatus ENUM('Single', 'Engaged' , 'Married'),
	about varchar(511),
	phone1 varchar(20),
	phone2 varchar(20)
);

CREATE TABLE IF NOT EXISTS friendships(
	friendshipID int AUTO_INCREMENT primary key,
	userID1 int(255) not null ,
	userID2 int(255) not null ,
	unique (userID1, userID2),
	FOREIGN KEY (userID1) REFERENCES users(userID),
	FOREIGN KEY (userID2) REFERENCES users(userID)
);

CREATE TABLE IF NOT EXISTS requests(
	requestID int AUTO_INCREMENT primary key,
	senderID int(255) not null ,
	recieverID int(255) not null ,
	unique (senderID, recieverID),
	FOREIGN KEY (senderID) REFERENCES users(userID),
	FOREIGN KEY (recieverID) REFERENCES users(userID)
);