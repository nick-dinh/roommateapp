/* Listings Table (Post Details) */
CREATE TABLE `listings` (
  `listingid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `author` varchar(16) NOT NULL DEFAULT '',
  `title` text,
  `location` text,
  `duration` text,
  `description` text,
  `timecreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`listingid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/* Groups Table (Handles Listing Group Joining) */
CREATE TABLE `groups` (
  `groupid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `listingid` int(11) unsigned NOT NULL DEFAULT '0',
  `maxcapacity` int(11) unsigned NOT NULL DEFAULT '4',
  `currentcapacity` int(11) unsigned NOT NULL DEFAULT '1',
  `members` text,
  PRIMARY KEY (`groupid`),
  KEY `fk_listingid` (`listingid`),
  CONSTRAINT `fk_listingid` FOREIGN KEY (`listingid`) REFERENCES `listings` (`listingid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
