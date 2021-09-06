-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 01, 2021 at 12:42 PM
-- Server version: 5.7.35-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tkexam`
--

-- --------------------------------------------------------

--
-- Table structure for table `sq_account_type`
--

CREATE TABLE `sq_account_type` (
  `id` int(11) NOT NULL,
  `account_name` varchar(256) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `access_permissions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_account_type`
--

INSERT INTO `sq_account_type` (`id`, `account_name`, `created_time`, `access_permissions`) VALUES
(1, 'Admin', '2021-01-18 13:30:08', 'all'),
(2, 'User', '2021-01-18 13:30:08', 'myAccount,myQuiz,attemptQuiz,myResult,resultView');

-- --------------------------------------------------------

--
-- Table structure for table `sq_answer`
--

CREATE TABLE `sq_answer` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `quid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_response` text NOT NULL,
  `response_time` int(11) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trash_status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_answer`
--

INSERT INTO `sq_answer` (`id`, `uid`, `quid`, `rid`, `question_id`, `user_response`, `response_time`, `created_time`, `trash_status`) VALUES
(1, 1, 1, 1, 1, '4', 1630490693, '2021-09-01 10:04:53', 0),
(2, 1, 1, 1, 3, '', 1630490693, '2021-09-01 10:04:53', 0),
(3, 1, 1, 1, 1, '4', 1630490699, '2021-09-01 10:04:59', 0),
(4, 1, 1, 1, 2, '5', 1630490699, '2021-09-01 10:04:59', 0),
(5, 1, 1, 1, 2, '8', 1630490699, '2021-09-01 10:04:59', 0),
(6, 1, 1, 1, 3, '', 1630490699, '2021-09-01 10:04:59', 0),
(7, 1, 1, 1, 1, '4', 1630490706, '2021-09-01 10:05:06', 0),
(8, 1, 1, 1, 2, '5', 1630490706, '2021-09-01 10:05:06', 0),
(9, 1, 1, 1, 2, '8', 1630490706, '2021-09-01 10:05:06', 0),
(10, 1, 1, 1, 3, 'delhi', 1630490706, '2021-09-01 10:05:06', 0),
(11, 1, 1, 1, 1, '4', 1630490709, '2021-09-01 10:05:09', 0),
(12, 1, 1, 1, 2, '5', 1630490709, '2021-09-01 10:05:09', 0),
(13, 1, 1, 1, 2, '8', 1630490709, '2021-09-01 10:05:09', 0),
(14, 1, 1, 1, 3, 'delhi', 1630490709, '2021-09-01 10:05:09', 0),
(15, 1, 1, 1, 1, '4', 1630490712, '2021-09-01 10:05:12', 0),
(16, 1, 1, 1, 2, '5', 1630490712, '2021-09-01 10:05:12', 0),
(17, 1, 1, 1, 2, '8', 1630490712, '2021-09-01 10:05:12', 0),
(18, 1, 1, 1, 3, 'delhi', 1630490712, '2021-09-01 10:05:12', 0),
(19, 1, 1, 1, 1, '4', 1630490748, '2021-09-01 10:05:48', 0),
(20, 1, 1, 1, 2, '5', 1630490748, '2021-09-01 10:05:48', 0),
(21, 1, 1, 1, 2, '8', 1630490748, '2021-09-01 10:05:48', 0),
(22, 1, 1, 1, 3, 'delhi', 1630490748, '2021-09-01 10:05:48', 0),
(23, 1, 1, 1, 1, '4', 1630490752, '2021-09-01 10:05:52', 0),
(24, 1, 1, 1, 2, '5', 1630490752, '2021-09-01 10:05:52', 0),
(25, 1, 1, 1, 2, '8', 1630490752, '2021-09-01 10:05:52', 0),
(26, 1, 1, 1, 3, 'delhi', 1630490752, '2021-09-01 10:05:52', 0),
(27, 1, 1, 1, 1, '4', 1630490861, '2021-09-01 10:07:41', 0),
(28, 1, 1, 1, 3, '', 1630490861, '2021-09-01 10:07:41', 0),
(29, 1, 1, 1, 1, '4', 1630490866, '2021-09-01 10:07:46', 0),
(30, 1, 1, 1, 2, '5', 1630490866, '2021-09-01 10:07:46', 0),
(31, 1, 1, 1, 2, '8', 1630490866, '2021-09-01 10:07:46', 0),
(32, 1, 1, 1, 3, '', 1630490866, '2021-09-01 10:07:46', 0),
(33, 1, 1, 1, 1, '4', 1630490871, '2021-09-01 10:07:51', 0),
(34, 1, 1, 1, 2, '5', 1630490871, '2021-09-01 10:07:51', 0),
(35, 1, 1, 1, 2, '8', 1630490871, '2021-09-01 10:07:51', 0),
(36, 1, 1, 1, 3, 'delhi', 1630490871, '2021-09-01 10:07:51', 0),
(37, 1, 1, 1, 1, '4', 1630490873, '2021-09-01 10:07:53', 0),
(38, 1, 1, 1, 2, '5', 1630490873, '2021-09-01 10:07:53', 0),
(39, 1, 1, 1, 2, '8', 1630490873, '2021-09-01 10:07:53', 0),
(40, 1, 1, 1, 3, 'delhi', 1630490873, '2021-09-01 10:07:53', 0);

-- --------------------------------------------------------

--
-- Table structure for table `sq_category`
--

CREATE TABLE `sq_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(256) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `trash_status` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_category`
--

INSERT INTO `sq_category` (`id`, `category_name`, `parent_id`, `trash_status`, `created_time`) VALUES
(1, 'Default', 0, 0, '2021-08-06 07:43:15'),
(2, 'Game', 0, 0, '2021-08-06 08:01:07'),
(3, 'Category-2', 0, 0, '2021-08-06 09:27:01'),
(4, 'Category-3', 1, 0, '2021-08-06 09:30:17'),
(5, 'Category-4', 4, 0, '2021-08-06 09:30:17');

-- --------------------------------------------------------

--
-- Table structure for table `sq_group`
--

CREATE TABLE `sq_group` (
  `id` int(11) NOT NULL,
  `group_name` varchar(256) NOT NULL,
  `trash_status` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_group`
--

INSERT INTO `sq_group` (`id`, `group_name`, `trash_status`, `created_time`) VALUES
(1, 'Default', 0, '2021-08-03 06:27:17'),
(2, 'Student-Group-1', 0, '2021-08-03 06:27:17'),
(3, 'Student-Group-2', 0, '2021-08-06 02:28:27'),
(4, 'Student-Group-3', 0, '2021-08-06 02:29:37'),
(5, 'Student-Group-4', 0, '2021-08-07 05:20:53');

-- --------------------------------------------------------

--
-- Table structure for table `sq_logs`
--

CREATE TABLE `sq_logs` (
  `id` int(11) NOT NULL,
  `log_time` int(11) NOT NULL,
  `log_event` varchar(1000) NOT NULL,
  `rid` int(11) NOT NULL,
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sq_metadata`
--

CREATE TABLE `sq_metadata` (
  `id` int(11) NOT NULL,
  `meta_type` varchar(256) NOT NULL,
  `meta_name` varchar(256) NOT NULL,
  `meta_value` text NOT NULL,
  `ref_id` int(11) NOT NULL,
  `trash_status` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sq_option`
--

CREATE TABLE `sq_option` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `question_option` text NOT NULL,
  `score` float NOT NULL,
  `trash_status` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_option`
--

INSERT INTO `sq_option` (`id`, `question_id`, `question_option`, `score`, `trash_status`, `created_time`) VALUES
(1, 1, '<p>5</p>', 0, 0, '2021-09-01 09:58:47'),
(2, 1, '<p>4</p>', 0, 0, '2021-09-01 09:58:47'),
(3, 1, '<p>6</p>', 0, 0, '2021-09-01 09:58:47'),
(4, 1, '<p>2</p>', 1, 0, '2021-09-01 09:58:47'),
(5, 2, 'Joe Biden', 0.5, 0, '2021-09-01 10:01:21'),
(6, 2, 'Obama', 0, 0, '2021-09-01 10:01:21'),
(7, 2, 'Trump', 0, 0, '2021-09-01 10:01:21'),
(8, 2, 'J. Biden', 0.5, 0, '2021-09-01 10:01:21'),
(9, 3, 'new delhi,New Delhi', 1, 0, '2021-09-01 10:02:11');

-- --------------------------------------------------------

--
-- Table structure for table `sq_question`
--

CREATE TABLE `sq_question` (
  `id` int(11) NOT NULL,
  `question_type` varchar(256) NOT NULL,
  `question` text NOT NULL,
  `description` text NOT NULL,
  `category_ids` int(11) NOT NULL,
  `trash_status` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_question`
--

INSERT INTO `sq_question` (`id`, `question_type`, `question`, `description`, `category_ids`, `trash_status`, `created_time`) VALUES
(1, 'Multiple Choice Single Answer', '<p>Solve</p>\r\n<p>\\[\\sqrt { 4 }\\]</p>', '', 1, 0, '2021-09-01 09:58:47'),
(2, 'Multiple Choice Multiple Answers', 'Who is the president of USA?', 'This description visible at result page only..', 1, 0, '2021-09-01 10:01:21'),
(3, 'Short Answer', 'What is the capital of India?', '', 1, 0, '2021-09-01 10:02:11');

-- --------------------------------------------------------

--
-- Table structure for table `sq_quiz`
--

CREATE TABLE `sq_quiz` (
  `id` int(11) NOT NULL,
  `quiz_name` varchar(256) NOT NULL,
  `description` varchar(256) NOT NULL,
  `start_datetime` int(11) NOT NULL,
  `end_datetime` int(11) NOT NULL,
  `qids` text NOT NULL,
  `gids` varchar(1000) NOT NULL,
  `max_attempt` int(11) NOT NULL DEFAULT '100',
  `min_pass_percentage` float NOT NULL,
  `correct_score` float NOT NULL DEFAULT '1',
  `incorrect_score` float NOT NULL DEFAULT '0',
  `instant_result` int(11) NOT NULL DEFAULT '0',
  `duration` int(11) NOT NULL DEFAULT '10',
  `show_result` int(11) NOT NULL DEFAULT '1',
  `show_result_on_date` int(11) NOT NULL DEFAULT '0',
  `trash_status` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_quiz`
--

INSERT INTO `sq_quiz` (`id`, `quiz_name`, `description`, `start_datetime`, `end_datetime`, `qids`, `gids`, `max_attempt`, `min_pass_percentage`, `correct_score`, `incorrect_score`, `instant_result`, `duration`, `show_result`, `show_result_on_date`, `trash_status`, `created_time`) VALUES
(1, 'Sample Quiz - Negative Marking', 'Quiz description here.\r\nCorrect marks : 1\r\nIncorrect Marks: -0.5', 1630441980, 1648758780, '1,2,3', '1,2,3,4,5', 100, 10, 1, -0.5, 0, 60, 1, 1630528440, 0, '2021-09-01 10:04:11');

-- --------------------------------------------------------

--
-- Table structure for table `sq_result`
--

CREATE TABLE `sq_result` (
  `id` int(11) NOT NULL,
  `quid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `attempted_datetime` int(11) NOT NULL,
  `assigned_qids` text NOT NULL,
  `qids_status` text NOT NULL,
  `ind_score` text NOT NULL,
  `attempted_questions` text NOT NULL,
  `time_spent` float NOT NULL,
  `ind_time` text NOT NULL,
  `result_status` varchar(256) NOT NULL DEFAULT 'Open',
  `last_ping` int(11) NOT NULL DEFAULT '0',
  `result_generated_time` int(11) NOT NULL DEFAULT '0',
  `obtained_score` float NOT NULL DEFAULT '0',
  `obtained_percentage` float NOT NULL DEFAULT '0',
  `result_generated_by` varchar(100) NOT NULL DEFAULT 'Not Generated',
  `response_time` int(11) NOT NULL,
  `color_codes` text NOT NULL,
  `trash_status` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_result`
--

INSERT INTO `sq_result` (`id`, `quid`, `uid`, `attempted_datetime`, `assigned_qids`, `qids_status`, `ind_score`, `attempted_questions`, `time_spent`, `ind_time`, `result_status`, `last_ping`, `result_generated_time`, `obtained_score`, `obtained_percentage`, `result_generated_by`, `response_time`, `color_codes`, `trash_status`, `created_time`) VALUES
(1, 1, 1, 1630490855, '1,2,3', '0,0,0', '1,1,-0.5', '1,1,1', 18, '5,5,7', 'Pass', 1630490855, 1630490873, 1.5, 50, 'User', 1630490873, 'answered,answered,answered', 0, '2021-09-01 10:07:35');

-- --------------------------------------------------------

--
-- Table structure for table `sq_setting`
--

CREATE TABLE `sq_setting` (
  `id` int(11) NOT NULL,
  `label_name` varchar(1000) NOT NULL,
  `setting_name` varchar(1000) NOT NULL,
  `setting_value` text NOT NULL,
  `order_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_setting`
--

INSERT INTO `sq_setting` (`id`, `label_name`, `setting_name`, `setting_value`, `order_by`) VALUES
(1, 'SMTP Host Name', 'smtp_host', 'mail.savsoftquiz.com', 1),
(2, 'SMTP Username', 'smtp_username', 'noreply@savsoftquiz124.com', 2),
(3, 'SMTP Password', 'smtp_password', '123456', 3),
(4, 'SMTP port', 'smtp_port', '587', 4);

-- --------------------------------------------------------

--
-- Table structure for table `sq_user`
--

CREATE TABLE `sq_user` (
  `id` int(11) NOT NULL,
  `username` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `full_name` varchar(256) DEFAULT NULL,
  `account_type_id` int(11) NOT NULL,
  `group_ids` varchar(256) NOT NULL,
  `user_token` varchar(256) NOT NULL,
  `trash_status` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sq_user`
--

INSERT INTO `sq_user` (`id`, `username`, `password`, `email`, `full_name`, `account_type_id`, `group_ids`, `user_token`, `trash_status`, `created_time`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'admin@example.com', 'Admin', 1, '1', 'logout-1630499672', 0, '2021-01-19 11:00:15'),
(2, 'user001', '21232f297a57a5a743894a0e4a801fc3', 'user001@example.com', 'User001', 2, '1', '691-1-1625912616', 0, '2021-01-19 11:00:15'),
(4, 'user002', 'e10adc3949ba59abbe56e057f20f883e', 'user002@example.com', 'User002', 2, '1', '', 0, '2021-08-03 09:37:50'),
(5, 'user003', 'e10adc3949ba59abbe56e057f20f883e', 'user003@example.com', 'User003', 2, '2', '', 0, '2021-08-03 09:40:00'),
(6, 'user', 'e10adc3949ba59abbe56e057f20f883e', 'user@example.com', 'User User', 2, '1', 'logout-1630410660', 0, '2021-08-31 10:51:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sq_account_type`
--
ALTER TABLE `sq_account_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `sq_answer`
--
ALTER TABLE `sq_answer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`),
  ADD KEY `quid` (`quid`),
  ADD KEY `rid` (`rid`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `sq_category`
--
ALTER TABLE `sq_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `sq_group`
--
ALTER TABLE `sq_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sq_logs`
--
ALTER TABLE `sq_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `rid` (`rid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `sq_metadata`
--
ALTER TABLE `sq_metadata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `meta_type` (`meta_type`);

--
-- Indexes for table `sq_option`
--
ALTER TABLE `sq_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `sq_question`
--
ALTER TABLE `sq_question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `sq_quiz`
--
ALTER TABLE `sq_quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `sq_result`
--
ALTER TABLE `sq_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `quid` (`quid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `sq_setting`
--
ALTER TABLE `sq_setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sq_user`
--
ALTER TABLE `sq_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD KEY `id` (`id`),
  ADD KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sq_account_type`
--
ALTER TABLE `sq_account_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `sq_answer`
--
ALTER TABLE `sq_answer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `sq_category`
--
ALTER TABLE `sq_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `sq_group`
--
ALTER TABLE `sq_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `sq_logs`
--
ALTER TABLE `sq_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `sq_metadata`
--
ALTER TABLE `sq_metadata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `sq_option`
--
ALTER TABLE `sq_option`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `sq_question`
--
ALTER TABLE `sq_question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `sq_quiz`
--
ALTER TABLE `sq_quiz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `sq_result`
--
ALTER TABLE `sq_result`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `sq_setting`
--
ALTER TABLE `sq_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `sq_user`
--
ALTER TABLE `sq_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
