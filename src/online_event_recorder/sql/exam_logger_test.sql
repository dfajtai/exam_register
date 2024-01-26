-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2024. Jan 26. 18:02
-- Kiszolgáló verziója: 8.0.35-0ubuntu0.22.04.1
-- PHP verzió: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `exam_logger_test`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `asset_definitions`
--

CREATE TABLE `asset_definitions` (
  `AssetID` int NOT NULL,
  `AssetName` varchar(32) NOT NULL,
  `AssetDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `AssetLocation` int NOT NULL,
  `AssetOwner` varchar(128) NOT NULL DEFAULT 'MEDICOPUS'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `asset_definitions`
--

INSERT INTO `asset_definitions` (`AssetID`, `AssetName`, `AssetDesc`, `AssetLocation`, `AssetOwner`) VALUES
(1, 'hatso CT', '', 5, 'SMKMOK'),
(2, 'asdasd', '', 1, 'Medicoups'),
(3, 'asdasd23', '', 1, 'Medicoups');

--
-- Eseményindítók `asset_definitions`
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
-- Tábla szerkezet ehhez a táblához `bodypart_definitions`
--

CREATE TABLE `bodypart_definitions` (
  `BodypartID` int NOT NULL,
  `BodypartName` varchar(127) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `BodypartDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `BodypartSide` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `bodypart_definitions`
--

INSERT INTO `bodypart_definitions` (`BodypartID`, `BodypartName`, `BodypartDesc`, `BodypartSide`) VALUES
(1, 'LIA', 'Left Anterior Iliac', 1),
(2, 'Undefined', 'Bodypart undefined', 4),
(3, 'RIA', '', 2);

--
-- Eseményindítók `bodypart_definitions`
--
DELIMITER $$
CREATE TRIGGER `bodypart_definitions_insert` AFTER INSERT ON `bodypart_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "bodypart_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `bodypart_definitions_update` AFTER UPDATE ON `bodypart_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "bodypart_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `consumable_definitions`
--

CREATE TABLE `consumable_definitions` (
  `ConsumableID` int NOT NULL,
  `ConsumableType` int NOT NULL COMMENT 'consumable_type_definitions.consumable_typeID',
  `ConsumableName` varchar(128) NOT NULL,
  `ConsumableDesc` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ConsumableUnitType` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `consumable_definitions`
--

INSERT INTO `consumable_definitions` (`ConsumableID`, `ConsumableType`, `ConsumableName`, `ConsumableDesc`, `ConsumableUnitType`) VALUES
(3, 3, 'saline', 'fiziológiás sóoldat', 1),
(4, 4, 'heparin', '', 1);

--
-- Eseményindítók `consumable_definitions`
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
-- Tábla szerkezet ehhez a táblához `consumable_type_definitions`
--

CREATE TABLE `consumable_type_definitions` (
  `ConsumableTypeID` int NOT NULL,
  `ConsumableTypeName` varchar(32) NOT NULL,
  `ConsumableTypeDesc` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `consumable_type_definitions`
--

INSERT INTO `consumable_type_definitions` (`ConsumableTypeID`, `ConsumableTypeName`, `ConsumableTypeDesc`) VALUES
(1, 'catheter', NULL),
(2, 'braunüle', NULL),
(3, 'solution', NULL),
(4, 'medicine', NULL),
(5, 'bandage', NULL),
(6, 'food', NULL);

--
-- Eseményindítók `consumable_type_definitions`
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
-- Tábla szerkezet ehhez a táblához `definition_tables`
--

CREATE TABLE `definition_tables` (
  `TableID` int NOT NULL,
  `TableName` varchar(127) NOT NULL,
  `LastChange` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Checksum` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `definition_tables`
--

INSERT INTO `definition_tables` (`TableID`, `TableName`, `LastChange`, `Checksum`) VALUES
(1, 'asset_definitions', '2023-12-18 12:53:06', 'd929f6cb'),
(2, 'event_status_definitions', '2023-11-23 11:37:03', 'e4c5b559'),
(3, 'location_definitions', '2023-12-04 13:54:31', '68c2bc19'),
(5, 'bodypart_definitions', '2023-12-07 10:25:34', '184dfa16'),
(6, 'subject_status_definitions', '2023-11-23 11:37:03', '5ae4c226'),
(7, 'unit_definitions', '2024-01-05 14:53:53', 'f4099e9f'),
(8, 'unit_type_definitions', '2024-01-04 15:43:01', 'c2835b14'),
(9, 'side_definitions', '2023-11-23 11:37:03', '1f2c2d75'),
(10, 'sex_definitions', '2023-11-23 11:37:03', '18eba199'),
(12, 'consumable_type_definitions', '2023-12-04 12:03:30', '666ec6a2'),
(13, 'consumable_definitions', '2024-01-15 12:40:51', 'c3ac4b16'),
(14, 'event_type_definitions', '2023-12-08 15:47:43', '48c3dca1'),
(15, 'event_template_definitions', '2024-01-17 10:48:26', '1c030179'),
(16, 'studies', '2024-01-26 18:00:29', '7f1098c3');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `event_change_log`
--

CREATE TABLE `event_change_log` (
  `EventChangeLogIndex` int NOT NULL,
  `EventIndex` int NOT NULL,
  `EventName` varchar(127) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EventStudy` int NOT NULL,
  `EventSubject` int NOT NULL,
  `EventData` json DEFAULT NULL,
  `EventModifiedBy` int NOT NULL,
  `EventModifiedAt` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `event_log`
--

CREATE TABLE `event_log` (
  `EventIndex` int NOT NULL,
  `EventTemplate` int NOT NULL COMMENT 'event_definitions.eventid',
  `EventName` varchar(127) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EventStatus` int DEFAULT NULL COMMENT 'event_status.eventstatusid',
  `EventPlannedTime` timestamp NULL DEFAULT NULL,
  `EventComment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EventData` json DEFAULT NULL,
  `EventStudy` int NOT NULL COMMENT 'studies.studyid',
  `EventSubject` int NOT NULL COMMENT 'subjects.subjectIndex',
  `EventLocation` int DEFAULT NULL COMMENT 'locations.locationid',
  `EventModifiedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `EventModifiedBy` int NOT NULL COMMENT 'users.userid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `event_status_definitions`
--

CREATE TABLE `event_status_definitions` (
  `EventStatusID` int NOT NULL,
  `EventStatusName` varchar(32) NOT NULL,
  `EventStatusDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `event_status_definitions`
--

INSERT INTO `event_status_definitions` (`EventStatusID`, `EventStatusName`, `EventStatusDescription`) VALUES
(1, 'planned', 'The event has been planned.'),
(2, 'inprogress', 'The event is in progress.'),
(3, 'skipped', ''),
(4, 'finished', ''),
(5, 'deleted', 'The event is hidden from the web application.');

--
-- Eseményindítók `event_status_definitions`
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
-- Tábla szerkezet ehhez a táblához `event_type_definitions`
--

CREATE TABLE `event_type_definitions` (
  `EventTypeID` int NOT NULL,
  `EventTypeName` varchar(32) NOT NULL,
  `EventTypeDesc` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `event_type_definitions`
--

INSERT INTO `event_type_definitions` (`EventTypeID`, `EventTypeName`, `EventTypeDesc`) VALUES
(1, 'measurement', 'any kind of measurement / assession performed on the subject'),
(2, 'treatment', NULL),
(3, 'transport', 'transport form one location to an another'),
(5, 'care', 'feeding, cleaning, brooming');

--
-- Eseményindítók `event_type_definitions`
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
-- Tábla szerkezet ehhez a táblához `location_definitions`
--

CREATE TABLE `location_definitions` (
  `LocationID` int NOT NULL,
  `LocationName` varchar(32) NOT NULL,
  `LocationDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `location_definitions`
--

INSERT INTO `location_definitions` (`LocationID`, `LocationName`, `LocationDesc`) VALUES
(1, 'angio', '-'),
(2, 'muto', '-'),
(3, 'telep', '-'),
(4, 'ketrec', '-'),
(5, 'diag', 'baka ct/mr'),
(6, 'pet', 'medicopus petmr/petct'),
(7, 'elokeszito', '');

--
-- Eseményindítók `location_definitions`
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
-- Tábla szerkezet ehhez a táblához `sex_definitions`
--

CREATE TABLE `sex_definitions` (
  `SexID` int NOT NULL,
  `SexName` varchar(32) NOT NULL,
  `SexDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `sex_definitions`
--

INSERT INTO `sex_definitions` (`SexID`, `SexName`, `SexDesc`) VALUES
(1, 'male', ''),
(2, 'female', ''),
(3, 'unknown', ''),
(4, 'castrated', NULL);

--
-- Eseményindítók `sex_definitions`
--
DELIMITER $$
CREATE TRIGGER `sex_definitions_insert` AFTER INSERT ON `sex_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "sex_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sex_definitions_update` AFTER UPDATE ON `sex_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "sex_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `side_definitions`
--

CREATE TABLE `side_definitions` (
  `SideID` int NOT NULL,
  `SideName` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SideShortName` char(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `side_definitions`
--

INSERT INTO `side_definitions` (`SideID`, `SideName`, `SideShortName`) VALUES
(1, 'left', 'L'),
(2, 'right', 'R'),
(3, 'both', 'B'),
(4, 'no_side', 'NA');

--
-- Eseményindítók `side_definitions`
--
DELIMITER $$
CREATE TRIGGER `side_definitions_insert` AFTER INSERT ON `side_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "side_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `side_definitions_update` AFTER UPDATE ON `side_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "side_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `studies`
--

CREATE TABLE `studies` (
  `StudyID` int NOT NULL,
  `StudyName` varchar(255) NOT NULL,
  `StudyDesc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `StudySpecies` varchar(64) NOT NULL,
  `StudyStart` date NOT NULL,
  `StudyEnd` date NOT NULL,
  `StudyNMax` int NOT NULL,
  `StudyNCurrent` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `studies`
--

INSERT INTO `studies` (`StudyID`, `StudyName`, `StudyDesc`, `StudySpecies`, `StudyStart`, `StudyEnd`, `StudyNMax`, `StudyNCurrent`) VALUES
(1, 'TestStudy', 'This is a test Study', 'pig', '2023-11-14', '2023-11-22', 42, 7),
(2, 'TestStudy2', 'This is a test Study', 'monkey', '2023-11-14', '2023-11-22', 20, 2),
(3, 'test', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ullamcorper malesuada odio condimentum cursus. Praesent ac leo vitae lacus viverra rutrum id in tortor. Ut sagittis quis dui non tincidunt. Etiam sit amet pretium augue. Nam id turpis id nisl vehicula laoreet nec in metus. Donec accumsan finibus fringilla. Mauris non maximus nisi. Aliquam erat volutpat. Suspendisse mattis, purus eu malesuada eleifend, orci dui varius quam, et aliquam diam dui ornare nibh.\n\nMauris sed euismod orci, ut elementum diam. Praesent eros est, fermentum vitae aliquam convallis, porttitor sed sapien. Donec sodales nibh nec facilisis vulputate. Nam dignissim erat quis gravida sodales. Integer eget nisi a lacus semper aliquet ac at libero. Vestibulum lectus turpis, tempor at egestas quis, tincidunt ac dolor. Maecenas tristique leo a imperdiet mollis. Nunc vel laoreet velit, at lacinia erat. Nam elit nulla, sagittis et justo nec, dapibus viverra risus. Mauris lorem eros, rhoncus nec hendrerit non, ornare eu massa.\n\nPraesent blandit odio pulvinar, suscipit nibh vitae, sodales nibh. Nullam in pharetra urna, eget aliquam mauris. Etiam metus metus, ornare vitae tortor quis, faucibus suscipit quam. Nulla vel nulla sed lorem aliquam ullamcorper sit amet eget lorem. Cras arcu diam, tempor vel sem et, consectetur blandit magna. Etiam rhoncus placerat tempor. Maecenas volutpat blandit pretium. Integer gravida nisl tempor, vehicula urna quis, porttitor purus. Integer vel libero orci. Donec ligula urna, venenatis non ex vel, dignissim rutrum mi. Ut consectetur quam vel mi porta ornare. Sed congue, tortor in auctor sollicitudin, nisl nisl porta dolor, sed posuere nisi nisi sit amet tellus. Mauris placerat mi in fringilla faucibus.\n\nPhasellus auctor urna volutpat mauris posuere, nec convallis magna interdum. Morbi nisi magna, auctor quis blandit semper, elementum eu orci. Vivamus non dignissim dui. Phasellus pulvinar sed sem maximus feugiat. Phasellus elit libero, cursus ut semper et, efficitur vitae diam. Sed ut eleifend ligula. Pellentesque venenatis purus nec lorem fermentum, ac volutpat ipsum lobortis. Sed eget sagittis odio. Vivamus rhoncus pellentesque magna ultrices viverra. Maecenas sit amet metus non ex dignissim laoreet.\n\nNulla facilisi. Donec a justo nec arcu imperdiet dictum. Suspendisse quis nulla faucibus, hendrerit felis a, fermentum diam. Nulla et ex accumsan justo semper sollicitudin sit amet a dui. Proin pharetra enim ac tortor mollis, sit amet imperdiet diam volutpat. Vestibulum fermentum tortor non orci efficitur, non auctor lorem mollis. In placerat ex eget diam condimentum porta. Aliquam erat volutpat. Sed non posuere nulla, ut euismod augue. Vivamus maximus porta dolor, eu luctus sem finibus at. In hac habitasse platea dictumst. Pellentesque suscipit aliquet pellentesque. Vestibulum nibh mauris, dignissim in fringilla vel, dictum at velit. Maecenas consequat dignissim erat, sit amet sollicitudin augue porta eu. ', 'kutyámajmok', '2023-12-04', '2024-01-03', 4, 0);

--
-- Eseményindítók `studies`
--
DELIMITER $$
CREATE TRIGGER `study_def_insert` AFTER INSERT ON `studies` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "studies"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `study_def_update` AFTER UPDATE ON `studies` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "studies"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `subjects`
--

CREATE TABLE `subjects` (
  `SubjectIndex` int NOT NULL,
  `SubjectID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `StudyID` int NOT NULL,
  `Name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Group` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `Sex` int DEFAULT NULL,
  `Container` int DEFAULT NULL,
  `Weight` double DEFAULT NULL,
  `Height` double DEFAULT NULL,
  `Location` int DEFAULT NULL,
  `Comment` text,
  `LastChange` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `Status` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Eseményindítók `subjects`
--
DELIMITER $$
CREATE TRIGGER `alter subject` AFTER UPDATE ON `subjects` FOR EACH ROW BEGIN
UPDATE studies SET StudyNCurrent = StudyNCurrent +1 WHERE StudyID = NEW.StudyID;
UPDATE studies SET StudyNCurrent = StudyNCurrent -1 WHERE StudyID = old.StudyID;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `delete subject` AFTER DELETE ON `subjects` FOR EACH ROW BEGIN
UPDATE studies SET StudyNCurrent = StudyNCurrent -1 WHERE StudyID = old.StudyID;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `new subject` AFTER INSERT ON `subjects` FOR EACH ROW BEGIN
UPDATE studies SET StudyNCurrent = StudyNCurrent +1 WHERE StudyID = NEW.StudyID;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `subject_change_log`
--

CREATE TABLE `subject_change_log` (
  `SubjectChangeLogIndex` int NOT NULL,
  `SubjectIndex` int NOT NULL,
  `NewSubjectID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NewSubjectName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NewSubjectGroup` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NewStudyID` int NOT NULL,
  `NewSubjectStatus` int DEFAULT NULL,
  `SubjectData` json DEFAULT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL COMMENT 'user id of the original subject state (since the last is stored in the subjects table)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `subject_status_definitions`
--

CREATE TABLE `subject_status_definitions` (
  `StatusID` int NOT NULL,
  `StatusName` varchar(16) NOT NULL,
  `StatusDescription` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `subject_status_definitions`
--

INSERT INTO `subject_status_definitions` (`StatusID`, `StatusName`, `StatusDescription`) VALUES
(1, 'pending', 'The subject has not been delivered yet.'),
(2, 'alive', 'The subject is alive.'),
(6, 'terminated', NULL),
(7, 'dead', NULL),
(8, 'deleted', NULL);

--
-- Eseményindítók `subject_status_definitions`
--
DELIMITER $$
CREATE TRIGGER `subject_status_definitions_insert` AFTER INSERT ON `subject_status_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "subject_status_definitions"
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `subject_status_definitions_update` AFTER UPDATE ON `subject_status_definitions` FOR EACH ROW UPDATE definition_tables
SET LastChange = NOW()
WHERE TableName = "subject_status_definitions"
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `unit_definitions`
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
-- A tábla adatainak kiíratása `unit_definitions`
--

INSERT INTO `unit_definitions` (`UnitID`, `UnitType`, `UnitName`, `UnitUnit`, `UnitAmount`, `UnitDesc`) VALUES
(0, 0, 'n.a.', '-', 1, ''),
(8, 1, 'milliliter', 'ml', 1, ''),
(9, 1, 'liter', 'l', 1, ''),
(10, 2, 'gramm', 'g', 1, ''),
(11, 2, 'kilogram', 'kg', 1, ''),
(12, 4, 'internation unit', 'IU', 1, ''),
(13, 7, 'mili per sec', 'ml/s', 1, ''),
(14, 6, 'minute', 'min', 1, ''),
(15, 6, 'second', 's', 1, ''),
(16, 5, 'milimeter', 'mm', 1, ''),
(17, 5, 'centimeter', 'cm', 1, ''),
(18, 5, 'meter', 'm', 1, ''),
(19, 8, 'celsius', '˚C', 1, '');

--
-- Eseményindítók `unit_definitions`
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
-- Tábla szerkezet ehhez a táblához `unit_type_definitions`
--

CREATE TABLE `unit_type_definitions` (
  `UnitTypeID` int NOT NULL,
  `UnitTypeName` varchar(127) NOT NULL,
  `UnitTypeDesc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `unit_type_definitions`
--

INSERT INTO `unit_type_definitions` (`UnitTypeID`, `UnitTypeName`, `UnitTypeDesc`) VALUES
(0, 'other', 'Other kind of units'),
(1, 'volume', 'Volume in ml, l, and so on.'),
(2, 'weight', 'Weight in g, mg, kg and so on.'),
(3, 'count', 'Count as count.'),
(4, 'unit', 'Unit as international unit or whatever.'),
(5, 'length', 'Length in m, cm, mm, and so on.'),
(6, 'duration', 'Duration in min, s, and so on.'),
(7, 'flow', 'Fluid flow speed in ml/s ml/h and so on.'),
(8, 'temperature', 'Temperature in °C, °F or K.');

--
-- Eseményindítók `unit_type_definitions`
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
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `UserID` int NOT NULL,
  `UserFullName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserEmail` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserPwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RegisterTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LastLogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CanResetPassword` tinyint(1) NOT NULL DEFAULT '0',
  `PasswordChanged` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `IsActivated` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`UserID`, `UserFullName`, `UserEmail`, `UserName`, `UserPwd`, `RegisterTimestamp`, `LastLogin`, `CanResetPassword`, `PasswordChanged`, `IsAdmin`, `IsActivated`) VALUES
(4, 'Fajtai Dániel', 'daniel.fajtai@gmail.com', 'dani', '$2y$10$Bpc2zYSmtVuywDr1/0HRWulGZwqBNULN3ucFsN8pBiZvcpQZ15ta2', '2023-11-14 14:20:06', '2024-01-26 18:02:07', 0, '2023-11-16 11:21:08', 1, 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `asset_definitions`
--
ALTER TABLE `asset_definitions`
  ADD PRIMARY KEY (`AssetID`),
  ADD KEY `AssetLocation` (`AssetLocation`);

--
-- A tábla indexei `bodypart_definitions`
--
ALTER TABLE `bodypart_definitions`
  ADD PRIMARY KEY (`BodypartID`),
  ADD UNIQUE KEY `BodypartName` (`BodypartName`),
  ADD KEY `BodypartSide` (`BodypartSide`);

--
-- A tábla indexei `consumable_definitions`
--
ALTER TABLE `consumable_definitions`
  ADD PRIMARY KEY (`ConsumableID`),
  ADD UNIQUE KEY `ConsumableName` (`ConsumableName`),
  ADD KEY `ConsumableUnitType` (`ConsumableUnitType`),
  ADD KEY `ConsumableType` (`ConsumableType`);

--
-- A tábla indexei `consumable_type_definitions`
--
ALTER TABLE `consumable_type_definitions`
  ADD PRIMARY KEY (`ConsumableTypeID`),
  ADD UNIQUE KEY `ConsumableTypeName` (`ConsumableTypeName`);

--
-- A tábla indexei `definition_tables`
--
ALTER TABLE `definition_tables`
  ADD PRIMARY KEY (`TableID`),
  ADD UNIQUE KEY `TableName` (`TableName`);

--
-- A tábla indexei `event_change_log`
--
ALTER TABLE `event_change_log`
  ADD PRIMARY KEY (`EventChangeLogIndex`),
  ADD KEY `EventModifiedBy` (`EventModifiedBy`),
  ADD KEY `EventStudy` (`EventStudy`),
  ADD KEY `event_change_log_ibfk_4` (`EventSubject`),
  ADD KEY `event_change_log_ibfk_1` (`EventIndex`);

--
-- A tábla indexei `event_log`
--
ALTER TABLE `event_log`
  ADD PRIMARY KEY (`EventIndex`),
  ADD KEY `event_log_ibfk_1` (`EventTemplate`),
  ADD KEY `EventLocation` (`EventLocation`),
  ADD KEY `EventModifiedBy` (`EventModifiedBy`),
  ADD KEY `event_log_ibfk_4` (`EventStudy`),
  ADD KEY `event_log_ibfk_5` (`EventStatus`),
  ADD KEY `event_log_ibfk_6` (`EventSubject`);

--
-- A tábla indexei `event_status_definitions`
--
ALTER TABLE `event_status_definitions`
  ADD PRIMARY KEY (`EventStatusID`),
  ADD UNIQUE KEY `EventStatusName` (`EventStatusName`);

--
-- A tábla indexei `event_type_definitions`
--
ALTER TABLE `event_type_definitions`
  ADD PRIMARY KEY (`EventTypeID`),
  ADD UNIQUE KEY `EventTypeName` (`EventTypeName`);

--
-- A tábla indexei `location_definitions`
--
ALTER TABLE `location_definitions`
  ADD PRIMARY KEY (`LocationID`),
  ADD UNIQUE KEY `LocationName` (`LocationName`);

--
-- A tábla indexei `sex_definitions`
--
ALTER TABLE `sex_definitions`
  ADD PRIMARY KEY (`SexID`),
  ADD UNIQUE KEY `SexName` (`SexName`);

--
-- A tábla indexei `side_definitions`
--
ALTER TABLE `side_definitions`
  ADD PRIMARY KEY (`SideID`),
  ADD UNIQUE KEY `SideShortName` (`SideShortName`);

--
-- A tábla indexei `studies`
--
ALTER TABLE `studies`
  ADD PRIMARY KEY (`StudyID`);

--
-- A tábla indexei `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`SubjectIndex`),
  ADD KEY `Status` (`Status`),
  ADD KEY `Sex` (`Sex`),
  ADD KEY `Location` (`Location`),
  ADD KEY `StudyID` (`StudyID`),
  ADD KEY `ModifiedBy` (`ModifiedBy`);

--
-- A tábla indexei `subject_change_log`
--
ALTER TABLE `subject_change_log`
  ADD PRIMARY KEY (`SubjectChangeLogIndex`),
  ADD KEY `CurrentStudyID` (`NewStudyID`),
  ADD KEY `ModifiedBy` (`ModifiedBy`),
  ADD KEY `subject_change_log_ibfk_3` (`SubjectIndex`),
  ADD KEY `NewSubjectStatus` (`NewSubjectStatus`);

--
-- A tábla indexei `subject_status_definitions`
--
ALTER TABLE `subject_status_definitions`
  ADD PRIMARY KEY (`StatusID`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

--
-- A tábla indexei `unit_definitions`
--
ALTER TABLE `unit_definitions`
  ADD PRIMARY KEY (`UnitID`),
  ADD KEY `unit_definitions_ibfk_1` (`UnitType`);

--
-- A tábla indexei `unit_type_definitions`
--
ALTER TABLE `unit_type_definitions`
  ADD PRIMARY KEY (`UnitTypeID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `username` (`UserName`),
  ADD UNIQUE KEY `UserName_2` (`UserName`),
  ADD UNIQUE KEY `UserEmail` (`UserEmail`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `asset_definitions`
--
ALTER TABLE `asset_definitions`
  MODIFY `AssetID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `bodypart_definitions`
--
ALTER TABLE `bodypart_definitions`
  MODIFY `BodypartID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `consumable_definitions`
--
ALTER TABLE `consumable_definitions`
  MODIFY `ConsumableID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `consumable_type_definitions`
--
ALTER TABLE `consumable_type_definitions`
  MODIFY `ConsumableTypeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `definition_tables`
--
ALTER TABLE `definition_tables`
  MODIFY `TableID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `event_change_log`
--
ALTER TABLE `event_change_log`
  MODIFY `EventChangeLogIndex` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `event_log`
--
ALTER TABLE `event_log`
  MODIFY `EventIndex` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `event_status_definitions`
--
ALTER TABLE `event_status_definitions`
  MODIFY `EventStatusID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `event_type_definitions`
--
ALTER TABLE `event_type_definitions`
  MODIFY `EventTypeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `location_definitions`
--
ALTER TABLE `location_definitions`
  MODIFY `LocationID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `sex_definitions`
--
ALTER TABLE `sex_definitions`
  MODIFY `SexID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `side_definitions`
--
ALTER TABLE `side_definitions`
  MODIFY `SideID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `studies`
--
ALTER TABLE `studies`
  MODIFY `StudyID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `subjects`
--
ALTER TABLE `subjects`
  MODIFY `SubjectIndex` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `subject_change_log`
--
ALTER TABLE `subject_change_log`
  MODIFY `SubjectChangeLogIndex` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `subject_status_definitions`
--
ALTER TABLE `subject_status_definitions`
  MODIFY `StatusID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `unit_definitions`
--
ALTER TABLE `unit_definitions`
  MODIFY `UnitID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `unit_type_definitions`
--
ALTER TABLE `unit_type_definitions`
  MODIFY `UnitTypeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `asset_definitions`
--
ALTER TABLE `asset_definitions`
  ADD CONSTRAINT `asset_definitions_ibfk_1` FOREIGN KEY (`AssetLocation`) REFERENCES `location_definitions` (`LocationID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Megkötések a táblához `bodypart_definitions`
--
ALTER TABLE `bodypart_definitions`
  ADD CONSTRAINT `bodypart_definitions_ibfk_1` FOREIGN KEY (`BodypartSide`) REFERENCES `side_definitions` (`SideID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Megkötések a táblához `consumable_definitions`
--
ALTER TABLE `consumable_definitions`
  ADD CONSTRAINT `consumable_definitions_ibfk_1` FOREIGN KEY (`ConsumableUnitType`) REFERENCES `unit_type_definitions` (`UnitTypeID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `consumable_definitions_ibfk_2` FOREIGN KEY (`ConsumableType`) REFERENCES `consumable_type_definitions` (`ConsumableTypeID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Megkötések a táblához `event_change_log`
--
ALTER TABLE `event_change_log`
  ADD CONSTRAINT `event_change_log_ibfk_1` FOREIGN KEY (`EventIndex`) REFERENCES `event_log` (`EventIndex`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_change_log_ibfk_2` FOREIGN KEY (`EventModifiedBy`) REFERENCES `users` (`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `event_change_log_ibfk_3` FOREIGN KEY (`EventStudy`) REFERENCES `studies` (`StudyID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `event_change_log_ibfk_4` FOREIGN KEY (`EventSubject`) REFERENCES `subjects` (`SubjectIndex`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `event_log`
--
ALTER TABLE `event_log`
  ADD CONSTRAINT `event_log_ibfk_1` FOREIGN KEY (`EventTemplate`) REFERENCES `event_template_definitions` (`EventTemplateID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `event_log_ibfk_2` FOREIGN KEY (`EventLocation`) REFERENCES `location_definitions` (`LocationID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `event_log_ibfk_3` FOREIGN KEY (`EventModifiedBy`) REFERENCES `users` (`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `event_log_ibfk_4` FOREIGN KEY (`EventStudy`) REFERENCES `studies` (`StudyID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `event_log_ibfk_5` FOREIGN KEY (`EventStatus`) REFERENCES `event_status_definitions` (`EventStatusID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `event_log_ibfk_6` FOREIGN KEY (`EventSubject`) REFERENCES `subjects` (`SubjectIndex`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Megkötések a táblához `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`Status`) REFERENCES `subject_status_definitions` (`StatusID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_2` FOREIGN KEY (`Sex`) REFERENCES `sex_definitions` (`SexID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_3` FOREIGN KEY (`Location`) REFERENCES `location_definitions` (`LocationID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_4` FOREIGN KEY (`StudyID`) REFERENCES `studies` (`StudyID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_5` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Megkötések a táblához `subject_change_log`
--
ALTER TABLE `subject_change_log`
  ADD CONSTRAINT `subject_change_log_ibfk_1` FOREIGN KEY (`NewStudyID`) REFERENCES `studies` (`StudyID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `subject_change_log_ibfk_2` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `subject_change_log_ibfk_3` FOREIGN KEY (`SubjectIndex`) REFERENCES `subjects` (`SubjectIndex`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subject_change_log_ibfk_4` FOREIGN KEY (`NewSubjectStatus`) REFERENCES `subject_status_definitions` (`StatusID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Megkötések a táblához `unit_definitions`
--
ALTER TABLE `unit_definitions`
  ADD CONSTRAINT `unit_definitions_ibfk_1` FOREIGN KEY (`UnitType`) REFERENCES `unit_type_definitions` (`UnitTypeID`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
