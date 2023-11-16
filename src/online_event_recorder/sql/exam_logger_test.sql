-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 15, 2023 at 03:41 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `consumable_type_definitions`
--

CREATE TABLE `consumable_type_definitions` (
  `ConsumableTypeID` int NOT NULL,
  `ConsumableTypeName` varchar(32) NOT NULL,
  `ConsumableTypeDesc` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `definition_tables`
--

CREATE TABLE `definition_tables` (
  `TableID` int NOT NULL,
  `TableName` varchar(127) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `definition_tables`
--

INSERT INTO `definition_tables` (`TableID`, `TableName`) VALUES
(1, 'asset_definitions'),
(2, 'event_status_definitions'),
(3, 'location_definitions'),
(4, 'measurement_definitions'),
(5, 'specimen_bodypart_definitions'),
(6, 'specimen_status_definitions'),
(7, 'unit_definitions'),
(8, 'unit_type_definitions'),
(9, 'side_definitions'),
(10, 'sex_definitions'),
(11, 'measurement_definitions'),
(12, 'consumable_type_definitions');

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

-- --------------------------------------------------------

--
-- Table structure for table `event_log`
--

CREATE TABLE `event_log` (
  `EventIndex` int NOT NULL,
  `EventID` varchar(32) NOT NULL COMMENT 'event_definitions.eventid',
  `EventStatus` int NOT NULL COMMENT 'event_status.eventstatusid',
  `EventComment` varchar(255) NOT NULL,
  `EventData` text NOT NULL,
  `EventStudy` int NOT NULL COMMENT 'studies.studyid',
  `EventSpecimen` int NOT NULL COMMENT 'specimens.specimenID',
  `EventLocation` int NOT NULL COMMENT 'locations.locationid',
  `EventModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
(3, 'transport', NULL);

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
(3, 'telep', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `measurement_definitions`
--

CREATE TABLE `measurement_definitions` (
  `MeasurementID` int NOT NULL,
  `MeasurementName` varchar(127) NOT NULL,
  `MeasurementDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `MeasurementUnitType` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sex_definitions`
--

CREATE TABLE `sex_definitions` (
  `SexID` int NOT NULL,
  `SexName` varchar(32) NOT NULL,
  `SexDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sex_definitions`
--

INSERT INTO `sex_definitions` (`SexID`, `SexName`, `SexDesc`) VALUES
(1, 'male', ''),
(2, 'female', ''),
(3, 'unknown', '');

-- --------------------------------------------------------

--
-- Table structure for table `side_definitions`
--

CREATE TABLE `side_definitions` (
  `SideID` int NOT NULL,
  `SideName` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SideShortName` char(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `side_definitions`
--

INSERT INTO `side_definitions` (`SideID`, `SideName`, `SideShortName`) VALUES
(1, 'left', 'L'),
(2, 'right', 'R'),
(3, 'both', 'B'),
(4, 'no_side', 'NA');

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
  `SpecimenLastChange` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SpecimenStatus` int NOT NULL
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
  `UnitAmount` double NOT NULL DEFAULT '0',
  `UnitComment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(5, 'length', 'length in m, cm, mm, and so on.'),
(6, 'duration', 'Duration in min, s, and so on.'),
(7, 'other', 'Other kind of units.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `fname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `register_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `username`, `password`, `register_time`, `IsAdmin`) VALUES
(4, 'Fajtai Dániel', 'dani', '$2y$10$Bpc2zYSmtVuywDr1/0HRWulGZwqBNULN3ucFsN8pBiZvcpQZ15ta2', '2023-11-14 14:20:06', 1),
(5, 'asd', 'asd', '$2y$10$cEzyrV3gWjP5xhok8EiSbOIWUgrFqJ4/pHW4QuX4MuKyJjlASrpjG', '2023-11-15 15:10:09', 0);

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
  ADD PRIMARY KEY (`TableID`);

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
-- Indexes for table `measurement_definitions`
--
ALTER TABLE `measurement_definitions`
  ADD PRIMARY KEY (`MeasurementID`);

--
-- Indexes for table `sex_definitions`
--
ALTER TABLE `sex_definitions`
  ADD PRIMARY KEY (`SexID`);

--
-- Indexes for table `side_definitions`
--
ALTER TABLE `side_definitions`
  ADD PRIMARY KEY (`SideID`);

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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

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
  MODIFY `ConsumableTypeID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `definition_tables`
--
ALTER TABLE `definition_tables`
  MODIFY `TableID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  MODIFY `EventTypeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `location_definitions`
--
ALTER TABLE `location_definitions`
  MODIFY `LocationID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `measurement_definitions`
--
ALTER TABLE `measurement_definitions`
  MODIFY `MeasurementID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sex_definitions`
--
ALTER TABLE `sex_definitions`
  MODIFY `SexID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `side_definitions`
--
ALTER TABLE `side_definitions`
  MODIFY `SideID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `specimens`
--
ALTER TABLE `specimens`
  MODIFY `SpecimenIndex` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `specimen_bodypart_definitions`
--
ALTER TABLE `specimen_bodypart_definitions`
  MODIFY `SpecimenBodypartID` int NOT NULL AUTO_INCREMENT;

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
  MODIFY `UnitTypeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
