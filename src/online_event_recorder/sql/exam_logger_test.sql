-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 23, 2023 at 12:07 PM
-- Server version: 8.0.35-0ubuntu0.22.04.1
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exam_logger_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `asset_definitions`
--

CREATE TABLE `asset_definitions` (
  `AssetID` int NOT NULL,
  `AssetName` varchar(32) NOT NULL,
  `AssetDescription` varchar(255) NOT NULL,
  `AssetLocation` int NOT NULL,
  `AssetOwner` varchar(128) NOT NULL DEFAULT 'MEDICOPUS'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `asset_definitions`
--
DELIMITER $$
CREATE TRIGGER `asset_definitions_insert` AFTER INSERT ON `asset_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "asset_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `asset_definitions_update` AFTER UPDATE ON `asset_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "asset_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `consumable_definitions`
--

CREATE TABLE `consumable_definitions` (
  `ConsumableID` int NOT NULL,
  `ConsumableType` int NOT NULL COMMENT 'consumable_type_definitions.consumable_typeID',
  `ConsumableName` varchar(128) NOT NULL,
  `ConsumableDesc` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ConsumableUnitType` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `consumable_definitions`
--
DELIMITER $$
CREATE TRIGGER `consumable_definitions_insert` AFTER INSERT ON `consumable_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "consumable_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `consumable_definitions_update` AFTER UPDATE ON `consumable_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "consumable_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `consumable_type_definitions`
--

CREATE TABLE `consumable_type_definitions` (
  `ConsumableTypeID` int NOT NULL,
  `ConsumableTypeName` varchar(32) NOT NULL,
  `ConsumableTypeDesc` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `consumable_type_definitions`
--

INSERT INTO `consumable_type_definitions` (`ConsumableTypeID`, `ConsumableTypeName`, `ConsumableTypeDesc`) VALUES
(1, 'catheter', NULL),
(2, 'braunüle', NULL),
(3, 'solution', NULL),
(4, 'medicine', NULL),
(5, 'bandage', NULL),
(6, 'food', NULL);

--
-- Triggers `consumable_type_definitions`
--
DELIMITER $$
CREATE TRIGGER `consumable_type_definitions_insert` AFTER INSERT ON `consumable_type_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "consumable_type_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `consumable_type_definitions_update` AFTER UPDATE ON `consumable_type_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "consumable_type_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `definition_tables`
--

CREATE TABLE `definition_tables` (
  `TableID` int NOT NULL,
  `TableName` varchar(127) NOT NULL,
  `LastChange` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `definition_tables`
--

INSERT INTO `definition_tables` (`TableID`, `TableName`, `LastChange`) VALUES
(1, 'asset_definitions', '2023-11-23 11:37:03'),
(2, 'event_status_definitions', '2023-11-23 11:37:03'),
(3, 'location_definitions', '2023-11-23 11:37:03'),
(5, 'specimen_bodypart_definitions', '2023-11-23 11:37:03'),
(6, 'specimen_status_definitions', '2023-11-23 11:37:03'),
(7, 'unit_definitions', '2023-11-23 11:37:03'),
(8, 'unit_type_definitions', '2023-11-23 11:50:47'),
(9, 'specimen_side_definitions', '2023-11-23 11:37:03'),
(10, 'specimen_sex_definitions', '2023-11-23 11:37:03'),
(12, 'consumable_type_definitions', '2023-11-23 11:37:03'),
(13, 'consumable_definitions', '2023-11-23 11:37:03'),
(14, 'event_type_definitions', '2023-11-23 11:37:03'),
(15, 'event_definitions', '2023-11-23 12:03:16');

-- --------------------------------------------------------

--
-- Table structure for table `event_change_log`
--

CREATE TABLE `event_change_log` (
  `EventChangeLogIndex` int NOT NULL,
  `EventIndex` int NOT NULL,
  `EventStudy` int NOT NULL,
  `EventSpecimen` int NOT NULL,
  `EventInfo` json DEFAULT NULL,
  `EventModifiedBy` int NOT NULL,
  `EventModifiedAt` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_definitions`
--

CREATE TABLE `event_definitions` (
  `EventID` int NOT NULL,
  `EventName` varchar(32) NOT NULL,
  `EventDescription` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EventType` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `event_definitions`
--
DELIMITER $$
CREATE TRIGGER `event_definitions_insert` AFTER INSERT ON `event_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "event_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `event_definitions_update` AFTER UPDATE ON `event_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "event_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `event_log`
--

CREATE TABLE `event_log` (
  `EventIndex` int NOT NULL,
  `EventID` varchar(32) NOT NULL COMMENT 'event_definitions.eventid',
  `EventStatus` int NOT NULL COMMENT 'event_status.eventstatusid',
  `EventComment` varchar(255) NOT NULL,
  `EventData` json NOT NULL,
  `EventStudy` int NOT NULL COMMENT 'studies.studyid',
  `EventSpecimen` int NOT NULL COMMENT 'specimens.specimenID',
  `EventLocation` int NOT NULL COMMENT 'locations.locationid',
  `EventModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `EventModifiedBy` int NOT NULL COMMENT 'users.userid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_status_definitions`
--

CREATE TABLE `event_status_definitions` (
  `EventStatusID` int NOT NULL,
  `EventStatusName` varchar(32) NOT NULL,
  `EventStatusDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `event_status_definitions`
--

INSERT INTO `event_status_definitions` (`EventStatusID`, `EventStatusName`, `EventStatusDescription`) VALUES
(1, 'planned', 'The event has been planned.'),
(2, 'inprogress', 'The event is in progress.'),
(3, 'skipped', ''),
(4, 'finished', ''),
(5, 'deleted', 'The event is hidden from the web application.');

--
-- Triggers `event_status_definitions`
--
DELIMITER $$
CREATE TRIGGER `event_status_definitions_insert` AFTER INSERT ON `event_status_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "event_status_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `event_status_definitions_update` AFTER UPDATE ON `event_status_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "event_status_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `event_type_definitions`
--

CREATE TABLE `event_type_definitions` (
  `EventTypeID` int NOT NULL,
  `EventTypeName` varchar(32) NOT NULL,
  `EventTypeDesc` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `event_type_definitions`
--

INSERT INTO `event_type_definitions` (`EventTypeID`, `EventTypeName`, `EventTypeDesc`) VALUES
(1, 'measurement', NULL),
(2, 'treatment', NULL),
(3, 'transport', NULL),
(4, 'examination', NULL);

--
-- Triggers `event_type_definitions`
--
DELIMITER $$
CREATE TRIGGER `event_type_definitions_insert` AFTER INSERT ON `event_type_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "event_type_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `event_type_definitions_update` AFTER UPDATE ON `event_type_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "event_type_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `location_definitions`
--

CREATE TABLE `location_definitions` (
  `LocationID` int NOT NULL,
  `LocationName` varchar(32) NOT NULL,
  `LocationDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `location_definitions`
--

INSERT INTO `location_definitions` (`LocationID`, `LocationName`, `LocationDesc`) VALUES
(1, 'angio', ''),
(2, 'muto', ''),
(3, 'telep', NULL),
(4, 'ketrec', NULL);

--
-- Triggers `location_definitions`
--
DELIMITER $$
CREATE TRIGGER `location_definitions_insert` AFTER INSERT ON `location_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "location_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `location_definitions_update` AFTER UPDATE ON `location_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "location_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `specimens`
--

CREATE TABLE `specimens` (
  `SpecimenIndex` int NOT NULL,
  `SpecimenID` varchar(32) NOT NULL,
  `StudyID` int NOT NULL,
  `SpecimenName` varchar(32) DEFAULT NULL,
  `SpecimenGroup` varchar(32) DEFAULT NULL,
  `SpecimenSex` int DEFAULT NULL,
  `SpecimenContainer` int DEFAULT NULL,
  `SpecimenWeight` double DEFAULT NULL,
  `SpecimenHeight` double DEFAULT NULL,
  `SpecimenLocation` int DEFAULT NULL,
  `SpecimenLastChange` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SpecimenModifiedBy` int NOT NULL,
  `SpecimenStatus` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `specimen_bodypart_definitions`
--

CREATE TABLE `specimen_bodypart_definitions` (
  `SpecimenBodypartID` int NOT NULL,
  `SpecimenBodypartName` varchar(127) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SpecimenBodypartDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `SpecimenBodypartSide` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `specimen_bodypart_definitions`
--
DELIMITER $$
CREATE TRIGGER `specimen_bodypart_definitions_insert` AFTER INSERT ON `specimen_bodypart_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "specimen_bodypart_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `specimen_bodypart_definitions_update` AFTER UPDATE ON `specimen_bodypart_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "specimen_bodypart_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `specimen_change_log`
--

CREATE TABLE `specimen_change_log` (
  `SpecimenLogIndex` int NOT NULL,
  `SpecimenIndex` int NOT NULL,
  `SpecimenID` varchar(32) DEFAULT NULL,
  `StudyID` int NOT NULL,
  `SpecimenName` varchar(32) DEFAULT NULL,
  `SpecimenGroup` varchar(32) DEFAULT NULL,
  `SpecimenData` json DEFAULT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ChangedBy` int NOT NULL COMMENT 'user id of the original specimen state (since the last is stored in the specimens table)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `specimen_sex_definitions`
--

CREATE TABLE `specimen_sex_definitions` (
  `SexID` int NOT NULL,
  `SexName` varchar(32) NOT NULL,
  `SexDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `specimen_sex_definitions`
--

INSERT INTO `specimen_sex_definitions` (`SexID`, `SexName`, `SexDesc`) VALUES
(1, 'male', ''),
(2, 'female', ''),
(3, 'unknown', ''),
(4, 'castrated', NULL);

--
-- Triggers `specimen_sex_definitions`
--
DELIMITER $$
CREATE TRIGGER `specimen_sex_definitions_insert` AFTER INSERT ON `specimen_sex_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "specimen_sex_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `specimen_sex_definitions_update` AFTER UPDATE ON `specimen_sex_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "specimen_sex_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `specimen_side_definitions`
--

CREATE TABLE `specimen_side_definitions` (
  `SideID` int NOT NULL,
  `SideName` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SideShortName` char(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `specimen_side_definitions`
--

INSERT INTO `specimen_side_definitions` (`SideID`, `SideName`, `SideShortName`) VALUES
(1, 'left', 'L'),
(2, 'right', 'R'),
(3, 'both', 'B'),
(4, 'no_side', 'NA');

--
-- Triggers `specimen_side_definitions`
--
DELIMITER $$
CREATE TRIGGER `specimen_side_definitions_insert` AFTER INSERT ON `specimen_side_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "specimen_side_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `specimen_side_definitions_update` AFTER UPDATE ON `specimen_side_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "specimen_side_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `specimen_status_definitions`
--

CREATE TABLE `specimen_status_definitions` (
  `StatusID` int NOT NULL,
  `StatusName` varchar(16) NOT NULL,
  `StatusDescription` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `specimen_status_definitions`
--

INSERT INTO `specimen_status_definitions` (`StatusID`, `StatusName`, `StatusDescription`) VALUES
(1, 'pending', 'The specimen has not been delivered yet.'),
(2, 'alive', 'The specimen is alive.'),
(6, 'terminated', NULL),
(7, 'dead', NULL),
(8, 'deleted', NULL);

--
-- Triggers `specimen_status_definitions`
--
DELIMITER $$
CREATE TRIGGER `specimen_status_definitions_insert` AFTER INSERT ON `specimen_status_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "specimen_status_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `specimen_status_definitions_update` AFTER UPDATE ON `specimen_status_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "specimen_status_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `studies`
--

CREATE TABLE `studies` (
  `StudyID` int NOT NULL,
  `StudyName` varchar(255) NOT NULL,
  `StudyDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `StudySpecies` varchar(64) NOT NULL,
  `StudyStart` date NOT NULL,
  `StudyEnd` date NOT NULL,
  `StudyN` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `studies`
--

INSERT INTO `studies` (`StudyID`, `StudyName`, `StudyDescription`, `StudySpecies`, `StudyStart`, `StudyEnd`, `StudyN`) VALUES
(1, 'TestStudy', 'This is a test Study', 'pig', '2023-11-14', '2023-11-22', 42),
(2, 'TestStudy2', 'This is a test Study', 'monkey', '2023-11-14', '2023-11-22', 42);

-- --------------------------------------------------------

--
-- Table structure for table `unit_definitions`
--

CREATE TABLE `unit_definitions` (
  `UnitID` int NOT NULL,
  `UnitType` int NOT NULL,
  `UnitName` varchar(32) NOT NULL,
  `UnitUnit` varchar(16) NOT NULL,
  `UnitAmount` double DEFAULT '1',
  `UnitDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `unit_definitions`
--
DELIMITER $$
CREATE TRIGGER `unit_def_insert` AFTER INSERT ON `unit_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "unit_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `unit_def_update` AFTER UPDATE ON `unit_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "unit_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `unit_type_definitions`
--

CREATE TABLE `unit_type_definitions` (
  `UnitTypeID` int NOT NULL,
  `UnitTypeName` varchar(127) NOT NULL,
  `UnitTypeDesc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `unit_type_definitions`
--

INSERT INTO `unit_type_definitions` (`UnitTypeID`, `UnitTypeName`, `UnitTypeDesc`) VALUES
(1, 'volume', 'Volume in ml, l, and so on.'),
(2, 'mass', 'Mass in g, mg, kg and so on.'),
(3, 'count', 'Count as count.'),
(4, 'unit', 'Unit as international unit or whatever.'),
(5, 'length', 'Length in m, cm, mm, and so on.'),
(6, 'duration', 'Duration in min, s, and so on.'),
(7, 'flow', 'Fluid flow speed in ml/s ml/h and so on.'),
(8, 'other', 'Other kind of units'),
(47, 'asd', 'qwe'),
(48, 'qweqerwr', 'qwe');

--
-- Triggers `unit_type_definitions`
--
DELIMITER $$
CREATE TRIGGER `unit_type_def_insert` AFTER INSERT ON `unit_type_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "unit_type_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `unit_type_def_update` AFTER UPDATE ON `unit_type_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "unit_type_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int NOT NULL,
  `UserFullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserEmail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserPwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RegisterTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LastLogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CanResetPassword` tinyint(1) NOT NULL DEFAULT '0',
  `PasswordChanged` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `UserFullName`, `UserEmail`, `UserName`, `UserPwd`, `RegisterTimestamp`, `LastLogin`, `CanResetPassword`, `PasswordChanged`, `IsAdmin`) VALUES
(4, 'Fajtai Dániel', 'daniel.fajtai@gmail.com', 'dani', '$2y$10$Bpc2zYSmtVuywDr1/0HRWulGZwqBNULN3ucFsN8pBiZvcpQZ15ta2', '2023-11-14 14:20:06', '2023-11-20 12:07:20', 0, '2023-11-16 11:21:08', 1),
(15, 'asd', 'asd@asd.asd', 'asd', '$2y$10$qvVyOzQ1qoMM7irFLLZuB.tbM2EJJfW2K/fPJ8KvFCStS2lf8cr7O', '2023-11-21 10:43:38', '2023-11-21 10:49:26', 0, '2023-11-21 11:43:38', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset_definitions`
--
ALTER TABLE `asset_definitions`
  ADD PRIMARY KEY (`AssetID`);

--
-- Indexes for table `consumable_definitions`
--
ALTER TABLE `consumable_definitions`
  ADD PRIMARY KEY (`ConsumableID`);

--
-- Indexes for table `consumable_type_definitions`
--
ALTER TABLE `consumable_type_definitions`
  ADD PRIMARY KEY (`ConsumableTypeID`);

--
-- Indexes for table `definition_tables`
--
ALTER TABLE `definition_tables`
  ADD PRIMARY KEY (`TableID`),
  ADD UNIQUE KEY `TableName` (`TableName`);

--
-- Indexes for table `event_change_log`
--
ALTER TABLE `event_change_log`
  ADD PRIMARY KEY (`EventChangeLogIndex`);

--
-- Indexes for table `event_definitions`
--
ALTER TABLE `event_definitions`
  ADD PRIMARY KEY (`EventID`);

--
-- Indexes for table `event_log`
--
ALTER TABLE `event_log`
  ADD PRIMARY KEY (`EventIndex`);

--
-- Indexes for table `event_status_definitions`
--
ALTER TABLE `event_status_definitions`
  ADD PRIMARY KEY (`EventStatusID`);

--
-- Indexes for table `event_type_definitions`
--
ALTER TABLE `event_type_definitions`
  ADD PRIMARY KEY (`EventTypeID`);

--
-- Indexes for table `location_definitions`
--
ALTER TABLE `location_definitions`
  ADD PRIMARY KEY (`LocationID`);

--
-- Indexes for table `specimens`
--
ALTER TABLE `specimens`
  ADD PRIMARY KEY (`SpecimenIndex`);

--
-- Indexes for table `specimen_bodypart_definitions`
--
ALTER TABLE `specimen_bodypart_definitions`
  ADD PRIMARY KEY (`SpecimenBodypartID`);

--
-- Indexes for table `specimen_change_log`
--
ALTER TABLE `specimen_change_log`
  ADD PRIMARY KEY (`SpecimenLogIndex`);

--
-- Indexes for table `specimen_sex_definitions`
--
ALTER TABLE `specimen_sex_definitions`
  ADD PRIMARY KEY (`SexID`);

--
-- Indexes for table `specimen_side_definitions`
--
ALTER TABLE `specimen_side_definitions`
  ADD PRIMARY KEY (`SideID`);

--
-- Indexes for table `specimen_status_definitions`
--
ALTER TABLE `specimen_status_definitions`
  ADD PRIMARY KEY (`StatusID`);

--
-- Indexes for table `studies`
--
ALTER TABLE `studies`
  ADD PRIMARY KEY (`StudyID`);

--
-- Indexes for table `unit_definitions`
--
ALTER TABLE `unit_definitions`
  ADD PRIMARY KEY (`UnitID`);

--
-- Indexes for table `unit_type_definitions`
--
ALTER TABLE `unit_type_definitions`
  ADD PRIMARY KEY (`UnitTypeID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `username` (`UserName`),
  ADD UNIQUE KEY `UserName_2` (`UserName`),
  ADD UNIQUE KEY `UserEmail` (`UserEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asset_definitions`
--
ALTER TABLE `asset_definitions`
  MODIFY `AssetID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consumable_definitions`
--
ALTER TABLE `consumable_definitions`
  MODIFY `ConsumableID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consumable_type_definitions`
--
ALTER TABLE `consumable_type_definitions`
  MODIFY `ConsumableTypeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `definition_tables`
--
ALTER TABLE `definition_tables`
  MODIFY `TableID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `event_change_log`
--
ALTER TABLE `event_change_log`
  MODIFY `EventChangeLogIndex` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_definitions`
--
ALTER TABLE `event_definitions`
  MODIFY `EventID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_log`
--
ALTER TABLE `event_log`
  MODIFY `EventIndex` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_status_definitions`
--
ALTER TABLE `event_status_definitions`
  MODIFY `EventStatusID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `event_type_definitions`
--
ALTER TABLE `event_type_definitions`
  MODIFY `EventTypeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `location_definitions`
--
ALTER TABLE `location_definitions`
  MODIFY `LocationID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `specimens`
--
ALTER TABLE `specimens`
  MODIFY `SpecimenIndex` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `specimen_bodypart_definitions`
--
ALTER TABLE `specimen_bodypart_definitions`
  MODIFY `SpecimenBodypartID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `specimen_change_log`
--
ALTER TABLE `specimen_change_log`
  MODIFY `SpecimenLogIndex` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `specimen_sex_definitions`
--
ALTER TABLE `specimen_sex_definitions`
  MODIFY `SexID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `specimen_side_definitions`
--
ALTER TABLE `specimen_side_definitions`
  MODIFY `SideID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `specimen_status_definitions`
--
ALTER TABLE `specimen_status_definitions`
  MODIFY `StatusID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `studies`
--
ALTER TABLE `studies`
  MODIFY `StudyID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `unit_definitions`
--
ALTER TABLE `unit_definitions`
  MODIFY `UnitID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unit_type_definitions`
--
ALTER TABLE `unit_type_definitions`
  MODIFY `UnitTypeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
