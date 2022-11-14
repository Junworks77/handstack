USE [master]
GO
/****** Object:  Database [HandTest]    Script Date: 2020-02-22 오후 3:44:16 ******/
CREATE DATABASE [HandTest]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'HandTest', FILENAME = N'D:\database\HandTest.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'HandTest_log', FILENAME = N'D:\database\HandTest_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [HandTest] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [HandTest].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [HandTest] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [HandTest] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [HandTest] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [HandTest] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [HandTest] SET ARITHABORT OFF 
GO
ALTER DATABASE [HandTest] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [HandTest] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [HandTest] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [HandTest] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [HandTest] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [HandTest] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [HandTest] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [HandTest] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [HandTest] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [HandTest] SET  DISABLE_BROKER 
GO
ALTER DATABASE [HandTest] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [HandTest] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [HandTest] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [HandTest] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [HandTest] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [HandTest] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [HandTest] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [HandTest] SET RECOVERY FULL 
GO
ALTER DATABASE [HandTest] SET  MULTI_USER 
GO
ALTER DATABASE [HandTest] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [HandTest] SET DB_CHAINING OFF 
GO
ALTER DATABASE [HandTest] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [HandTest] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [HandTest] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'HandTest', N'ON'
GO
ALTER DATABASE [HandTest] SET QUERY_STORE = OFF
GO
USE [HandTest]
GO
/****** Object:  Table [dbo].[Application]    Script Date: 2020-02-22 오후 3:44:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Application](
	[ApplicationID] [int] IDENTITY(1,1) NOT NULL,
	[ApplicationCode] [char](3) NULL,
	[ApplicationName] [nvarchar](50) NULL,
	[Description] [nvarchar](200) NULL,
	[UseYN] [bit] NOT NULL,
	[CreateUserID] [int] NULL,
	[CreateDateTime] [datetime] NULL,
 CONSTRAINT [PK_Application] PRIMARY KEY CLUSTERED 
(
	[ApplicationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CodeDetail]    Script Date: 2020-02-22 오후 3:44:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CodeDetail](
	[ApplicationID] [int] NOT NULL,
	[CodeGroupID] [varchar](10) NOT NULL,
	[CodeID] [varchar](10) NOT NULL,
	[CodeValue] [nvarchar](50) NOT NULL,
	[Custom1] [varchar](30) NULL,
	[Custom2] [varchar](30) NULL,
	[Custom3] [varchar](30) NULL,
	[SelectYN] [bit] NULL,
	[DisplayOrder] [int] NOT NULL,
	[UseYN] [bit] NOT NULL,
	[CreatePersonID] [int] NOT NULL,
	[CreateDateTime] [datetime] NOT NULL,
 CONSTRAINT [PK_CodeDetail] PRIMARY KEY CLUSTERED 
(
	[ApplicationID] ASC,
	[CodeGroupID] ASC,
	[CodeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CodeGroup]    Script Date: 2020-02-22 오후 3:44:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CodeGroup](
	[ApplicationID] [int] NOT NULL,
	[CodeGroupID] [varchar](10) NOT NULL,
	[CodeType] [char](1) NOT NULL,
	[CodeGroupName] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](200) NULL,
	[Custom1] [varchar](30) NULL,
	[Custom2] [varchar](30) NULL,
	[Custom3] [varchar](30) NULL,
	[UseYN] [bit] NOT NULL,
	[CreatePersonID] [int] NOT NULL,
	[CreateDateTime] [datetime] NOT NULL,
 CONSTRAINT [PK_CodeGroup] PRIMARY KEY CLUSTERED 
(
	[ApplicationID] ASC,
	[CodeGroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Application] ON 
GO
INSERT [dbo].[Application] ([ApplicationID], [ApplicationCode], [ApplicationName], [Description], [UseYN], [CreateUserID], [CreateDateTime]) VALUES (1, N'SYN', N'QCN Application Framework', N'큐씨엔 Qrame ALM 솔루션', 1, 1, CAST(N'2020-02-11T16:32:36.270' AS DateTime))
GO
INSERT [dbo].[Application] ([ApplicationID], [ApplicationCode], [ApplicationName], [Description], [UseYN], [CreateUserID], [CreateDateTime]) VALUES (2, N'YCP', N'Yoons Commerce Project', N'큐씨엔 이커머스', 1, 4, CAST(N'2020-02-19T16:27:21.270' AS DateTime))
GO
INSERT [dbo].[Application] ([ApplicationID], [ApplicationCode], [ApplicationName], [Description], [UseYN], [CreateUserID], [CreateDateTime]) VALUES (3, N'TEX', N'TexWindow Mall', N'대구경북섬유직물공업협동조합 재고 원단 몰0', 1, 1, CAST(N'2020-02-22T14:53:15.660' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Application] OFF
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM001', N'0', N'권한없음', N'', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM001', N'1', N'권한존재', N'', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM002', N'1', N'상단', N'2', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM002', N'2', N'메인', N'1', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM002', N'3', N'좌측', N'', N'', N'', NULL, 3, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM002', N'4', N'전체', N'2', N'', N'', NULL, 4, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM002', N'9', N'기타', N'2', N'', N'', NULL, 5, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM003', N'0', N'메인화면', N'', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM003', N'1', N'서브화면', N'', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM003', N'2', N'팝업화면', N'', N'', N'', NULL, 3, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM003', N'3', N'버튼화면', N'', N'', N'', NULL, 4, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM003', N'4', N'게시화면', N'', N'', N'', NULL, 5, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM003', N'5', N'폴더', N'', N'', N'', NULL, 6, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM003', N'9', N'공통연결화면', N'', N'', N'', NULL, 9, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM004', N'1', N'양력', N'', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM004', N'2', N'음력', N'', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM005', N'0', N'아니오', N'', N'', N'', NULL, 3, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM005', N'1', N'예', N'', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM006', N'0', N'일반', N'', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM006', N'1', N'관리', N'', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM006', N'2', N'시스템', N'', N'', N'', NULL, 3, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM006', N'3', N'연동', N'', N'', N'', NULL, 4, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM009', N'1', N'남', N'M', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM009', N'2', N'여', N'F', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM009', N'3', N'무', N'X', N'', N'', NULL, 3, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'01', N'A', N'', N'', N'', NULL, 992, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'02', N'B', N'', N'', N'', NULL, 993, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'03', N'AB', N'', N'', N'', NULL, 994, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'04', N'O', N'', N'', N'', NULL, 995, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'05', N'RH-A', N'', N'', N'', NULL, 996, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'06', N'RH-B', N'', N'', N'', NULL, 997, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'07', N'RH-AB', N'', N'', N'', NULL, 998, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'08', N'RH-O', N'', N'', N'', NULL, 999, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM011', N'01', N'기독교', N'', N'', N'', NULL, 1001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM011', N'02', N'기타', N'', N'', N'', NULL, 1001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM011', N'03', N'무교', N'', N'', N'', NULL, 1002, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM011', N'04', N'불교', N'', N'', N'', NULL, 1003, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM011', N'05', N'유교', N'', N'', N'', NULL, 1004, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM011', N'06', N'이단종교', N'', N'', N'', NULL, 1005, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM011', N'07', N'천주교', N'', N'', N'', NULL, 1006, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'01', N'AUSTRAILIA', N'', N'', N'', NULL, 1007, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'02', N'JAPAN', N'', N'', N'', NULL, 1008, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'03', N'THIALAND', N'', N'', N'', NULL, 1009, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'04', N'TAIWAN', N'', N'', N'', NULL, 1011, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'05', N'U.S.A', N'', N'', N'', NULL, 1011, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'06', N'BRAZIL', N'', N'', N'', NULL, 1012, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'07', N'CANADA', N'', N'', N'', NULL, 1013, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'08', N'CHINA', N'', N'', N'', NULL, 1014, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'09', N'ECUADOR', N'', N'', N'', NULL, 1015, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'11', N'HONGKONG', N'', N'', N'', NULL, 1016, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'12', N'INDONESIA', N'', N'', N'', NULL, 1017, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'13', N'MALAYSIA', N'', N'', N'', NULL, 1018, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'14', N'NEWZEALAND', N'', N'', N'', NULL, 1019, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'15', N'VIETNAM', N'', N'', N'', NULL, 1021, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'16', N'GUAM', N'', N'', N'', NULL, 1021, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'17', N'MYANMAR', N'', N'', N'', NULL, 1022, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'18', N'AFRICA', N'', N'', N'', NULL, 1023, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'19', N'ARGENTINA', N'', N'', N'', NULL, 1024, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'20', N'AUSTRIA', N'', N'', N'', NULL, 1025, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'21', N'BELGIUM', N'', N'', N'', NULL, 1026, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'22', N'BOLIVIA', N'', N'', N'', NULL, 1027, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'23', N'CAMBODIA', N'', N'', N'', NULL, 1028, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'24', N'COLOMBIA', N'', N'', N'', NULL, 1029, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'25', N'DOMINCA', N'', N'', N'', NULL, 1031, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'26', N'FIJI', N'', N'', N'', NULL, 1031, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'27', N'FRANCE', N'', N'', N'', NULL, 1032, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'28', N'GERMANY', N'', N'', N'', NULL, 1033, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'29', N'INDIA', N'', N'', N'', NULL, 1034, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'30', N'ITALY', N'', N'', N'', NULL, 1035, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'31', N'KAZAKHSTAN', N'', N'', N'', NULL, 1036, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'32', N'KENYA', N'', N'', N'', NULL, 1037, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'33', N'KYRGIZSTAN', N'', N'', N'', NULL, 1038, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'34', N'MEXICO', N'', N'', N'', NULL, 1039, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'35', N'MONGOLIA', N'', N'', N'', NULL, 1041, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'36', N'NEPAL', N'', N'', N'', NULL, 1041, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'37', N'PAKISTAN', N'', N'', N'', NULL, 1042, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'38', N'PARAGUAY', N'', N'', N'', NULL, 1043, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'39', N'PERU', N'', N'', N'', NULL, 1044, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'40', N'PHILIPPINES', N'', N'', N'', NULL, 1045, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'41', N'PORTUCAL', N'', N'', N'', NULL, 1046, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'42', N'RUMANIA', N'', N'', N'', NULL, 1047, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'43', N'RUSSIA', N'', N'', N'', NULL, 1048, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'44', N'SAIPAN', N'', N'', N'', NULL, 1049, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'45', N'SINGAPORE', N'', N'', N'', NULL, 1051, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'46', N'SURINAME', N'', N'', N'', NULL, 1051, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'47', N'TAJIKISTAN', N'', N'', N'', NULL, 1052, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'48', N'TURKEY', N'', N'', N'', NULL, 1053, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'49', N'U.K.', N'', N'', N'', NULL, 1054, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'50', N'UZBEKISTAN', N'', N'', N'', NULL, 1055, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'99', N'기타', N'', N'', N'', NULL, 1056, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'1', N'결혼', N'', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'2', N'미혼', N'', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'3', N'과부', N'', N'', N'', NULL, 7, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'4', N'홀아비', N'', N'', N'', NULL, 8, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'5', N'이혼', N'', N'', N'', NULL, 4, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'6', N'별거', N'', N'', N'', NULL, 6, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'7', N'재혼', N'', N'', N'', NULL, 5, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'8', N'사별', N'', N'', N'', NULL, 3, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'0', N'기록없음', N'', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'1000', N'공무원', N'', N'', N'', NULL, 1001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'10000', N'연구직', N'', N'', N'', NULL, 10001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'11000', N'관리직', N'', N'', N'', NULL, 11001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'12000', N'금융업', N'', N'', N'', NULL, 12001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'13000', N'마케팅/영업직', N'', N'', N'', NULL, 13001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'14000', N'기술/기능직', N'', N'', N'', NULL, 14001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15001', N'서비스업(호텔/숙박 서비스업)', N'', N'', N'', NULL, 15001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15002', N'서비스업(음식/외식 서비스업)', N'', N'', N'', NULL, 15002, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15003', N'서비스업(운전/운항 서비스업)', N'', N'', N'', NULL, 15003, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15004', N'서비스업(여행서비스업)', N'', N'', N'', NULL, 15004, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15005', N'서비스업(미용서비스업)', N'', N'', N'', NULL, 15005, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15006', N'서비스업(결혼/행사 서비스업)', N'', N'', N'', NULL, 15006, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15007', N'서비스업(경비/보안서비스업)', N'', N'', N'', NULL, 15007, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15008', N'서비스업(장의관련 서비스업)', N'', N'', N'', NULL, 15008, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15009', N'서비스업(건강관련)', N'', N'', N'', NULL, 15009, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15010', N'서비스업(오락 서비스업)', N'', N'', N'', NULL, 15011, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'15011', N'서비스업(안내 서비스업)', N'', N'', N'', NULL, 15011, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'16000', N'IT/정보통신업', N'', N'', N'', NULL, 16001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'17000', N'농/임/어/축/광업', N'', N'', N'', NULL, 17001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'18001', N'개인사업(서비스업)', N'', N'', N'', NULL, 18001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'18002', N'개인사업(제조업종)', N'', N'', N'', NULL, 18002, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'18003', N'개인사업(정보통신업)', N'', N'', N'', NULL, 18003, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'19001', N'학생(초등학생)', N'', N'', N'', NULL, 19001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'19002', N'학생(중학생)', N'', N'', N'', NULL, 19002, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'19003', N'학생(고등학생)', N'', N'', N'', NULL, 19003, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'19004', N'학생(대학생/대학원생)', N'', N'', N'', NULL, 19004, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'19005', N'기타 학생', N'', N'', N'', NULL, 19005, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'2000', N'법조인', N'', N'', N'', NULL, 2001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'20000', N'전업주부', N'', N'', N'', NULL, 20001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'21000', N'군인', N'', N'', N'', NULL, 21001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'22000', N'회사원', N'', N'', N'', NULL, 22001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'23000', N'무직', N'', N'', N'', NULL, 23001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'24000', N'기타직종종사자', N'', N'', N'', NULL, 24001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'3000', N'의사', N'', N'', N'', NULL, 3001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'4000', N'의료전문가', N'', N'', N'', NULL, 4001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'5001', N'언론및방송인(방송관련직종)', N'', N'', N'', NULL, 5001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'5002', N'언론및방송인(연예인관련직종)', N'', N'', N'', NULL, 5002, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'5003', N'언론및방송인(언론관련직종)', N'', N'', N'', NULL, 5003, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'6001', N'예술및스포츠(예술가)', N'', N'', N'', NULL, 6001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'6002', N'예술및스포츠(스포츠인)', N'', N'', N'', NULL, 6002, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'7000', N'종교인/사회사업단체', N'', N'', N'', NULL, 7001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8001', N'교육직(보육교사(영아보육))', N'', N'', N'', NULL, 8001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8002', N'교육직(유치원 교사)', N'', N'', N'', NULL, 8002, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8003', N'교육직(초등학교 교사)', N'', N'', N'', NULL, 8003, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8004', N'교육직(중고등학교 교사)', N'', N'', N'', NULL, 8004, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8005', N'교육직(초중고등학교 교직원)', N'', N'', N'', NULL, 8005, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8006', N'교육직(기타교사)', N'', N'', N'', NULL, 8006, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8007', N'교육직(대학교수)', N'', N'', N'', NULL, 8007, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8008', N'교육직(대학교/대학원 교직원)', N'', N'', N'', NULL, 8008, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8009', N'교육직(학원강사(과외교사 포함))', N'', N'', N'', NULL, 8009, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'8010', N'교육직(특수학교 교사)', N'', N'', N'', NULL, 8011, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'9000', N'신흥전문직', N'', N'', N'', NULL, 9001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0000', N'기록없음', N'0', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0001', N'검찰사무직', N'1000', N'', N'', NULL, 1, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0002', N'마약수사직', N'1000', N'', N'', NULL, 2, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0003', N'출입국관리직', N'1000', N'', N'', NULL, 3, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0004', N'경찰공무원', N'1000', N'', N'', NULL, 4, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0005', N'소방공무원', N'1000', N'', N'', NULL, 5, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0006', N'외무공무원', N'1000', N'', N'', NULL, 6, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0007', N'국가정보원', N'1000', N'', N'', NULL, 7, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0008', N'국회의원', N'1000', N'', N'', NULL, 8, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0009', N'철도공무원', N'1000', N'', N'', NULL, 9, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0010', N'군무원', N'1000', N'', N'', NULL, 11, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0011', N'행정직(중앙행정공무원)', N'1000', N'', N'', NULL, 11, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0012', N'행정직(지방행정공무원)', N'1000', N'', N'', NULL, 12, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0013', N'행정직(세무직)', N'1000', N'', N'', NULL, 13, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0014', N'행정직(관세직)', N'1000', N'', N'', NULL, 14, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0015', N'행정직(교육행정)', N'1000', N'', N'', NULL, 15, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0016', N'행정직(사회복지)', N'1000', N'', N'', NULL, 16, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0017', N'행정직(노동)', N'1000', N'', N'', NULL, 17, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0018', N'행정직(문화)', N'1000', N'', N'', NULL, 18, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0019', N'행정직(공보)', N'1000', N'', N'', NULL, 19, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0020', N'행정직(통계)', N'1000', N'', N'', NULL, 21, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0021', N'행정직(감사)', N'1000', N'', N'', NULL, 21, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0022', N'행정직(사서)', N'1000', N'', N'', NULL, 22, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0023', N'광공업직군(기계/전기/전자/원자력)', N'1000', N'', N'', NULL, 23, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0024', N'광공업직군(조선)', N'1000', N'', N'', NULL, 24, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0025', N'광공업직군(금속/섬유/화공/자원)', N'1000', N'', N'', NULL, 25, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0026', N'농림수산직군(농업/임업/축산/수산)', N'1000', N'', N'', NULL, 26, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0027', N'농림수산직군(식물검역)', N'1000', N'', N'', NULL, 27, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0028', N'농림수산직군(수의)', N'1000', N'', N'', NULL, 28, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0029', N'연구직(물리)', N'1000', N'', N'', NULL, 29, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0030', N'연구직(기상)', N'1000', N'', N'', NULL, 31, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0031', N'연구직(환경)', N'1000', N'', N'', NULL, 31, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0032', N'연구직(학예)', N'1000', N'', N'', NULL, 32, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0033', N'연구직(편사)', N'1000', N'', N'', NULL, 33, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0034', N'연구직(공업)', N'1000', N'', N'', NULL, 34, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0035', N'연구직(농업/농공연구/임업/축산/수산)', N'1000', N'', N'', NULL, 35, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0036', N'연구직(잠업/가축위생)', N'1000', N'', N'', NULL, 36, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0037', N'연구직(보건)', N'1000', N'', N'', NULL, 37, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0038', N'연구직(토목/건축연구)', N'1000', N'', N'', NULL, 38, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0039', N'보건의무직(보건/간호)', N'1000', N'', N'', NULL, 39, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0040', N'보건의무직(식품위생)', N'1000', N'', N'', NULL, 41, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0041', N'보건의무직(의료기술/의무/약무)', N'1000', N'', N'', NULL, 41, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0042', N'교통직(교통)', N'1000', N'', N'', NULL, 42, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0043', N'교통직(선박)', N'1000', N'', N'', NULL, 43, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0044', N'교통직(항공)', N'1000', N'', N'', NULL, 44, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0045', N'교통직(수로)', N'1000', N'', N'', NULL, 45, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0046', N'시설직(도시계획/토목/건축)', N'1000', N'', N'', NULL, 46, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0047', N'시설직(지적/측지)', N'1000', N'', N'', NULL, 47, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0048', N'정보통신직(전산)', N'1000', N'', N'', NULL, 48, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0049', N'정보통신직(통신사/통신기술/전송기술)', N'1000', N'', N'', NULL, 49, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0050', N'지도직(농촌/어촌/생활지도)', N'1000', N'', N'', NULL, 51, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0051', N'기타 공무원', N'1000', N'', N'', NULL, 51, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0052', N'판사', N'2000', N'', N'', NULL, 52, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0053', N'검사', N'2000', N'', N'', NULL, 53, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0054', N'변호사', N'2000', N'', N'', NULL, 54, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0055', N'법무사', N'2000', N'', N'', NULL, 55, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0056', N'공증인', N'2000', N'', N'', NULL, 56, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0057', N'집달관', N'2000', N'', N'', NULL, 57, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0058', N'행정서사', N'2000', N'', N'', NULL, 58, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0059', N'변리사', N'2000', N'', N'', NULL, 59, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0060', N'기타 법조인', N'2000', N'', N'', NULL, 61, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0061', N'한의학과', N'3000', N'', N'', NULL, 61, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0062', N'내과', N'3000', N'', N'', NULL, 62, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0063', N'소아과', N'3000', N'', N'', NULL, 63, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0064', N'신경정신과', N'3000', N'', N'', NULL, 64, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0065', N'피부과', N'3000', N'', N'', NULL, 65, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0066', N'(일반)외과', N'3000', N'', N'', NULL, 66, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0067', N'흉부외과', N'3000', N'', N'', NULL, 67, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0068', N'흉부내과', N'3000', N'', N'', NULL, 68, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0069', N'정형외과', N'3000', N'', N'', NULL, 69, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0070', N'신경외과', N'3000', N'', N'', NULL, 71, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0071', N'성형외과', N'3000', N'', N'', NULL, 71, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0072', N'산부인과', N'3000', N'', N'', NULL, 72, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0073', N'안과', N'3000', N'', N'', NULL, 73, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0074', N'이비인후과', N'3000', N'', N'', NULL, 74, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0075', N'비뇨기과', N'3000', N'', N'', NULL, 75, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0076', N'재활의학과', N'3000', N'', N'', NULL, 76, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0077', N'방사선종양학과', N'3000', N'', N'', NULL, 77, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0078', N'가정의학과', N'3000', N'', N'', NULL, 78, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0079', N'응급의학과', N'3000', N'', N'', NULL, 79, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0080', N'산업의학과', N'3000', N'', N'', NULL, 81, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0081', N'예방의학과', N'3000', N'', N'', NULL, 81, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0082', N'해부병리과', N'3000', N'', N'', NULL, 82, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0083', N'치과', N'3000', N'', N'', NULL, 83, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0084', N'마취통증의학과', N'3000', N'', N'', NULL, 84, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0085', N'영상의학과(진단방사선과)', N'3000', N'', N'', NULL, 85, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0086', N'진단검사의학과', N'3000', N'', N'', NULL, 86, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0087', N'핵의학과', N'3000', N'', N'', NULL, 87, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0088', N'조직병리학과', N'3000', N'', N'', NULL, 88, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0089', N'결핵과', N'3000', N'', N'', NULL, 89, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0090', N'인턴(수련의)', N'3000', N'', N'', NULL, 91, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0091', N'공중보건의', N'3000', N'', N'', NULL, 91, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0092', N'기타학과', N'3000', N'', N'', NULL, 92, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0093', N'약사', N'4000', N'', N'', NULL, 93, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0094', N'간호사', N'4000', N'', N'', NULL, 94, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0095', N'수의사', N'4000', N'', N'', NULL, 95, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0096', N'영양사', N'4000', N'', N'', NULL, 96, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0097', N'검안사', N'4000', N'', N'', NULL, 97, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0098', N'안경조정사', N'4000', N'', N'', NULL, 98, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0099', N'의료방사선기술공', N'4000', N'', N'', NULL, 99, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0100', N'치과기공사', N'4000', N'', N'', NULL, 101, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0101', N'조산사', N'4000', N'', N'', NULL, 101, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0102', N'물리치료사', N'4000', N'', N'', NULL, 102, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0103', N'안마사', N'4000', N'', N'', NULL, 103, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0104', N'언어청각사', N'4000', N'', N'', NULL, 104, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0105', N'언어치료사', N'4000', N'', N'', NULL, 105, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0106', N'위생사', N'4000', N'', N'', NULL, 106, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0107', N'작업치료사', N'4000', N'', N'', NULL, 107, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0108', N'접골사', N'4000', N'', N'', NULL, 108, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0109', N'정형외과석고기사', N'4000', N'', N'', NULL, 109, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0110', N'척추지압사', N'4000', N'', N'', NULL, 111, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0111', N'침구사', N'4000', N'', N'', NULL, 111, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0112', N'구급요원', N'4000', N'', N'', NULL, 112, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0113', N'기타 의료전문가', N'4000', N'', N'', NULL, 113, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0114', N'프로듀서 및 디렉터', N'5001', N'', N'', NULL, 114, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0115', N'조연출', N'5001', N'', N'', NULL, 115, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0116', N'기술감독', N'5001', N'', N'', NULL, 116, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0117', N'편집감독', N'5001', N'', N'', NULL, 117, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0118', N'조명감독', N'5001', N'', N'', NULL, 118, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0119', N'송출감독', N'5001', N'', N'', NULL, 119, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0120', N'운행감독', N'5001', N'', N'', NULL, 121, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0121', N'스크립터', N'5001', N'', N'', NULL, 121, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0122', N'방송엔지니어', N'5001', N'', N'', NULL, 122, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0123', N'스위처/화상믹서', N'5001', N'', N'', NULL, 123, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0124', N'무대감독', N'5001', N'', N'', NULL, 124, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0125', N'플로어맨/무대', N'5001', N'', N'', NULL, 125, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0126', N'전기계', N'5001', N'', N'', NULL, 126, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0127', N'특수효과계', N'5001', N'', N'', NULL, 127, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0128', N'영화제작부', N'5001', N'', N'', NULL, 128, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0129', N'카메라맨', N'5001', N'', N'', NULL, 129, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0130', N'카메라크루', N'5001', N'', N'', NULL, 131, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0131', N'비디오맨', N'5001', N'', N'', NULL, 131, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0132', N'비디오저널리스트', N'5001', N'', N'', NULL, 132, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0133', N'오디오맨', N'5001', N'', N'', NULL, 133, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0134', N'사운드크루', N'5001', N'', N'', NULL, 134, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0135', N'작가', N'5001', N'', N'', NULL, 135, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0136', N'컴퓨터그래픽디자이너', N'5001', N'', N'', NULL, 136, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0137', N'셑트디자이너', N'5001', N'', N'', NULL, 137, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0138', N'조명디자이너', N'5001', N'', N'', NULL, 138, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0139', N'스틸기사', N'5001', N'', N'', NULL, 139, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0140', N'기타 방송관련직종 종사자', N'5001', N'', N'', NULL, 141, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0141', N'연극배우', N'5002', N'', N'', NULL, 141, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0142', N'영화배우 및 탤랜트', N'5002', N'', N'', NULL, 142, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0143', N'코미디언', N'5002', N'', N'', NULL, 143, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0144', N'가수', N'5002', N'', N'', NULL, 144, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0145', N'모델', N'5002', N'', N'', NULL, 145, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0146', N'아나운서', N'5002', N'', N'', NULL, 146, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0147', N'리포터', N'5002', N'', N'', NULL, 147, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0148', N'VJ', N'5002', N'', N'', NULL, 148, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0149', N'성우', N'5002', N'', N'', NULL, 149, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0150', N'전문연예 사회자', N'5002', N'', N'', NULL, 151, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0151', N'작곡가 및 작사가', N'5002', N'', N'', NULL, 151, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0152', N'연예인 매니저', N'5002', N'', N'', NULL, 152, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0153', N'메이크업아티스트', N'5002', N'', N'', NULL, 153, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0154', N'코디네이터', N'5002', N'', N'', NULL, 154, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0155', N'기타 연예인관련직종 종사자', N'5002', N'', N'', NULL, 155, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0156', N'기자', N'5003', N'', N'', NULL, 156, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0157', N'평론가', N'5003', N'', N'', NULL, 157, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0158', N'편집자', N'5003', N'', N'', NULL, 158, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0159', N'기타 언론관련직종 종사자', N'5003', N'', N'', NULL, 159, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0160', N'화가', N'6001', N'', N'', NULL, 161, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0161', N'조각가', N'6001', N'', N'', NULL, 161, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0162', N'사진작가', N'6001', N'', N'', NULL, 162, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0163', N'시인', N'6001', N'', N'', NULL, 163, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0164', N'작가', N'6001', N'', N'', NULL, 164, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0165', N'성악가', N'6001', N'', N'', NULL, 165, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0166', N'국악인', N'6001', N'', N'', NULL, 166, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0167', N'무용가', N'6001', N'', N'', NULL, 167, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0168', N'안무가', N'6001', N'', N'', NULL, 168, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0169', N'기악연주자', N'6001', N'', N'', NULL, 169, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0170', N'관현악단 지휘자', N'6001', N'', N'', NULL, 171, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0171', N'기타 예술가', N'6001', N'', N'', NULL, 171, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0172', N'운동선수', N'6002', N'', N'', NULL, 172, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0173', N'경기 심판', N'6002', N'', N'', NULL, 173, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0174', N'경기 감독 및 코치', N'6002', N'', N'', NULL, 174, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0175', N'기타 운동관련 종사자', N'6002', N'', N'', NULL, 175, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0176', N'기독교 교역자', N'7000', N'', N'', NULL, 176, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0177', N'타종교 종사자', N'7000', N'', N'', NULL, 177, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0178', N'사회사업 종사자', N'7000', N'', N'', NULL, 178, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0179', N'비영리단체 종사자', N'7000', N'', N'', NULL, 179, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0180', N'기타 종교관계 종사자', N'7000', N'', N'', NULL, 181, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0181', N'보육교사(영아보육)', N'8001', N'', N'', NULL, 181, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0182', N'유치원 교사', N'8002', N'', N'', NULL, 182, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0183', N'초등학교 교사', N'8003', N'', N'', NULL, 183, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0184', N'국어', N'8004', N'', N'', NULL, 184, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0185', N'수학', N'8004', N'', N'', NULL, 185, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0186', N'과학', N'8004', N'', N'', NULL, 186, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0187', N'사회', N'8004', N'', N'', NULL, 187, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0188', N'국사', N'8004', N'', N'', NULL, 188, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0189', N'도덕(윤리)', N'8004', N'', N'', NULL, 189, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0190', N'기술', N'8004', N'', N'', NULL, 191, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0191', N'가정', N'8004', N'', N'', NULL, 191, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0192', N'전산', N'8004', N'', N'', NULL, 192, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0193', N'미술', N'8004', N'', N'', NULL, 193, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0194', N'음악', N'8004', N'', N'', NULL, 194, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0195', N'체육', N'8004', N'', N'', NULL, 195, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0196', N'외국어과(영어)', N'8004', N'', N'', NULL, 196, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0197', N'외국어과(일어)', N'8004', N'', N'', NULL, 197, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0198', N'외국어과(불어)', N'8004', N'', N'', NULL, 198, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0199', N'외국어과(독어)', N'8004', N'', N'', NULL, 199, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0200', N'외국어과(중국어)', N'8004', N'', N'', NULL, 201, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0201', N'외국어과(서반아어)', N'8004', N'', N'', NULL, 201, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0202', N'외국어과(기타)', N'8004', N'', N'', NULL, 202, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0203', N'기타과목 교사', N'8004', N'', N'', NULL, 203, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0204', N'교장 및 교감', N'8005', N'', N'', NULL, 204, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0205', N'기타 교직원', N'8005', N'', N'', NULL, 205, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0206', N'보조교사', N'8006', N'', N'', NULL, 206, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0207', N'학습지교사', N'8006', N'', N'', NULL, 207, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0208', N'기타 교사', N'8006', N'', N'', NULL, 208, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0209', N'어문계열(언어학과)', N'8007', N'', N'', NULL, 209, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0210', N'어문계열(국어국문학과)', N'8007', N'', N'', NULL, 211, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0211', N'어문계열(영어영문학과)', N'8007', N'', N'', NULL, 211, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0212', N'어문계열(중어중문학과)', N'8007', N'', N'', NULL, 212, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0213', N'어문계열(일어일문학과)', N'8007', N'', N'', NULL, 213, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0214', N'어문계열(불어불문학과)', N'8007', N'', N'', NULL, 214, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0215', N'어문계열(독어독문학과)', N'8007', N'', N'', NULL, 215, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0216', N'어문계열(이태리어과)', N'8007', N'', N'', NULL, 216, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0217', N'어문계열(네덜란드어과)', N'8007', N'', N'', NULL, 217, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0218', N'어문계열(폴란드어과)', N'8007', N'', N'', NULL, 218, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0219', N'어문계열(포르투칼어과)', N'8007', N'', N'', NULL, 219, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0220', N'어문계열(체코어과)', N'8007', N'', N'', NULL, 221, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0221', N'어문계열(루마니아어과)', N'8007', N'', N'', NULL, 221, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0222', N'어문계열(헝가리어과)', N'8007', N'', N'', NULL, 222, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0223', N'어문계열(노어노문학과)', N'8007', N'', N'', NULL, 223, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0224', N'어문계열(서어서문학과)', N'8007', N'', N'', NULL, 224, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0225', N'어문계열(베트남어과)', N'8007', N'', N'', NULL, 225, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0226', N'어문계열(태국어과)', N'8007', N'', N'', NULL, 226, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0227', N'어문계열(말레이인도네시아어과)', N'8007', N'', N'', NULL, 227, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0228', N'어문계열(아랍어과)', N'8007', N'', N'', NULL, 228, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0229', N'어문계열(이란어과)', N'8007', N'', N'', NULL, 229, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0230', N'어문계열(몽골어문학과)', N'8007', N'', N'', NULL, 231, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0231', N'어문계열(미얀마어과)', N'8007', N'', N'', NULL, 231, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0232', N'어문계열(스칸디나비아어과)', N'8007', N'', N'', NULL, 232, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0233', N'어문계열(아프리카어과)', N'8007', N'', N'', NULL, 233, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0234', N'어문계열(유고어과)', N'8007', N'', N'', NULL, 234, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0235', N'어문계열(터어키어과)', N'8007', N'', N'', NULL, 235, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0236', N'어문계열(인도어과)', N'8007', N'', N'', NULL, 236, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0237', N'어문계열(중앙아시아어과)', N'8007', N'', N'', NULL, 237, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0238', N'어문계열(한문학과)', N'8007', N'', N'', NULL, 238, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0239', N'어문계열(통번역학과)', N'8007', N'', N'', NULL, 239, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0240', N'어문계열(기타)', N'8007', N'', N'', NULL, 241, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0241', N'인문계열(고고인류학과)', N'8007', N'', N'', NULL, 241, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0242', N'인문계열(문예창작학과)', N'8007', N'', N'', NULL, 242, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0243', N'인문계열(국민윤리학과)', N'8007', N'', N'', NULL, 243, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0244', N'인문계열(미국학과)', N'8007', N'', N'', NULL, 244, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0245', N'인문계열(영미지역학과)', N'8007', N'', N'', NULL, 245, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0246', N'인문계열(북미학과)', N'8007', N'', N'', NULL, 246, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0247', N'인문계열(유럽학과)', N'8007', N'', N'', NULL, 247, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0248', N'인문계열(프랑스학과)', N'8007', N'', N'', NULL, 248, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0249', N'인문계열(독일학과)', N'8007', N'', N'', NULL, 249, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0250', N'인문계열(러시아학과)', N'8007', N'', N'', NULL, 251, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0251', N'인문계열(아랍학과)', N'8007', N'', N'', NULL, 251, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0252', N'인문계열(히브리학과)', N'8007', N'', N'', NULL, 252, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0253', N'인문계열(아시아지역학과)', N'8007', N'', N'', NULL, 253, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0254', N'인문계열(중국학과)', N'8007', N'', N'', NULL, 254, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0255', N'인문계열(일본학과)', N'8007', N'', N'', NULL, 255, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0256', N'인문계열(한국학과)', N'8007', N'', N'', NULL, 256, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0257', N'인문계열(민속학과)', N'8007', N'', N'', NULL, 257, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0258', N'인문계열(미학과)', N'8007', N'', N'', NULL, 258, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0259', N'인문계열(사학과)', N'8007', N'', N'', NULL, 259, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0260', N'인문계열(철학과)', N'8007', N'', N'', NULL, 261, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0261', N'인문계열(기타)', N'8007', N'', N'', NULL, 261, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0262', N'신학계열(종교학과)', N'8007', N'', N'', NULL, 262, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0263', N'신학계열(신학과)', N'8007', N'', N'', NULL, 263, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0264', N'신학계열(기독교학과)', N'8007', N'', N'', NULL, 264, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0265', N'신학계열(불교학과)', N'8007', N'', N'', NULL, 265, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0266', N'신학계열(기타)', N'8007', N'', N'', NULL, 266, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0267', N'사회계열(광고홍보학과)', N'8007', N'', N'', NULL, 267, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0268', N'사회계열(언론정보학과)', N'8007', N'', N'', NULL, 268, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0269', N'사회계열(신문방송학과)', N'8007', N'', N'', NULL, 269, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0270', N'사회계열(국제문화정보학과)', N'8007', N'', N'', NULL, 271, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0271', N'사회계열(심리학과)', N'8007', N'', N'', NULL, 271, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0272', N'사회계열(아동학과)', N'8007', N'', N'', NULL, 272, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0273', N'사회계열(노년학과)', N'8007', N'', N'', NULL, 273, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0274', N'사회계열(사회학과)', N'8007', N'', N'', NULL, 274, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0275', N'사회계열(북한학과)', N'8007', N'', N'', NULL, 275, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0276', N'사회계열(부동산학과)', N'8007', N'', N'', NULL, 276, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0277', N'사회계열(지리학과)', N'8007', N'', N'', NULL, 277, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0278', N'사회계열(지적학과)', N'8007', N'', N'', NULL, 278, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0279', N'사회계열(풍수지리학과)', N'8007', N'', N'', NULL, 279, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0280', N'사회계열(문화재보존학과)', N'8007', N'', N'', NULL, 281, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0281', N'사회계열(지역사회개발학과)', N'8007', N'', N'', NULL, 281, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0282', N'사회계열(사회복지학과)', N'8007', N'', N'', NULL, 282, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0283', N'사회계열(사회사업학과)', N'8007', N'', N'', NULL, 283, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0284', N'사회계열(문헌정보학과)', N'8007', N'', N'', NULL, 284, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0285', N'사회계열(도서관학과)', N'8007', N'', N'', NULL, 285, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0286', N'사회계열(청소년지도학과)', N'8007', N'', N'', NULL, 286, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0287', N'사회계열(기타)', N'8007', N'', N'', NULL, 287, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0288', N'법정계열(법학과)', N'8007', N'', N'', NULL, 288, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0289', N'법정계열(국제법무학과)', N'8007', N'', N'', NULL, 289, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0290', N'법정계열(정치외교학과)', N'8007', N'', N'', NULL, 291, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0291', N'법정계열(행정학과)', N'8007', N'', N'', NULL, 291, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0292', N'법정계열(경찰행정학과)', N'8007', N'', N'', NULL, 292, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0293', N'법정계열(기타)', N'8007', N'', N'', NULL, 293, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0294', N'경상계열(경영학과)', N'8007', N'', N'', NULL, 294, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0295', N'경상계열(경제학과)', N'8007', N'', N'', NULL, 295, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0296', N'경상계열(무역학과)', N'8007', N'', N'', NULL, 296, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0297', N'경상계열(경영정보학과)', N'8007', N'', N'', NULL, 297, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0298', N'경상계열(국제경영학과)', N'8007', N'', N'', NULL, 298, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0299', N'경상계열(국제무역학과)', N'8007', N'', N'', NULL, 299, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0300', N'경상계열(국제통상학과)', N'8007', N'', N'', NULL, 301, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0301', N'경상계열(관광경영학과)', N'8007', N'', N'', NULL, 301, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0302', N'경상계열(관광통역학과)', N'8007', N'', N'', NULL, 302, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0303', N'경상계열(호텔경영학과)', N'8007', N'', N'', NULL, 303, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0304', N'경상계열(회계학과)', N'8007', N'', N'', NULL, 304, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0305', N'경상계열(비서학과)', N'8007', N'', N'', NULL, 305, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0306', N'경상계열(보험학과)', N'8007', N'', N'', NULL, 306, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0307', N'경상계열(유통정보학과)', N'8007', N'', N'', NULL, 307, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0308', N'경상계열(의료경영학과)', N'8007', N'', N'', NULL, 308, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0309', N'경상계열(창업정보학과)', N'8007', N'', N'', NULL, 309, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0310', N'경상계열(기타)', N'8007', N'', N'', NULL, 311, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0311', N'수학계열(수학과)', N'8007', N'', N'', NULL, 311, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0312', N'수학계열(통계학과)', N'8007', N'', N'', NULL, 312, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0313', N'수학계열(기타)', N'8007', N'', N'', NULL, 313, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0314', N'자연과학계열(화학과)', N'8007', N'', N'', NULL, 314, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0315', N'자연과학계열(물리학과)', N'8007', N'', N'', NULL, 315, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0316', N'자연과학계열(생물학과)', N'8007', N'', N'', NULL, 316, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0317', N'자연과학계열(천문학과)', N'8007', N'', N'', NULL, 317, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0318', N'자연과학계열(지질학과)', N'8007', N'', N'', NULL, 318, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0319', N'자연과학계열(지구과학과)', N'8007', N'', N'', NULL, 319, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0320', N'자연과학계열(생명과학과)', N'8007', N'', N'', NULL, 321, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0321', N'자연과학계열(지구환경학과)', N'8007', N'', N'', NULL, 321, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0322', N'자연과학계열(대기환경학과)', N'8007', N'', N'', NULL, 322, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0323', N'자연과학계열(항공교통학과)', N'8007', N'', N'', NULL, 323, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0324', N'자연과학계열(응용생명환경학과)', N'8007', N'', N'', NULL, 324, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0325', N'자연과학계열(분자생물학과)', N'8007', N'', N'', NULL, 325, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0326', N'자연과학계열(유전공학과)', N'8007', N'', N'', NULL, 326, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0327', N'자연과학계열(동물자원학과)', N'8007', N'', N'', NULL, 327, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0328', N'자연과학계열(기타)', N'8007', N'', N'', NULL, 328, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0329', N'공학계열(전기공학과)', N'8007', N'', N'', NULL, 329, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0330', N'공학계열(전자공학과)', N'8007', N'', N'', NULL, 331, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0331', N'공학계열(전자통신공학과)', N'8007', N'', N'', NULL, 331, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0332', N'공학계열(전자재료공학과)', N'8007', N'', N'', NULL, 332, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0333', N'공학계열(정보시스템공학과)', N'8007', N'', N'', NULL, 333, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0334', N'공학계열(제어계측공학과)', N'8007', N'', N'', NULL, 334, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0335', N'공학계열(기계공학과)', N'8007', N'', N'', NULL, 335, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0336', N'공학계열(정보통신공학과)', N'8007', N'', N'', NULL, 336, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0337', N'공학계열(정보처리공학과)', N'8007', N'', N'', NULL, 337, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0338', N'공학계열(금속공학과)', N'8007', N'', N'', NULL, 338, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0339', N'공학계열(재료공학과)', N'8007', N'', N'', NULL, 339, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0340', N'공학계열(자원공학과)', N'8007', N'', N'', NULL, 341, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0341', N'공학계열(원자력공학과)', N'8007', N'', N'', NULL, 341, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0342', N'공학계열(신소재공학과)', N'8007', N'', N'', NULL, 342, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0343', N'공학계열(세라믹공학과)', N'8007', N'', N'', NULL, 343, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0344', N'공학계열(섬유공학과)', N'8007', N'', N'', NULL, 344, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0345', N'공학계열(생산가공공학과)', N'8007', N'', N'', NULL, 345, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0346', N'공학계열(산업공학과)', N'8007', N'', N'', NULL, 346, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0347', N'공학계열(컴퓨터공학과)', N'8007', N'', N'', NULL, 347, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0348', N'공학계열(메카트로닉스공학과)', N'8007', N'', N'', NULL, 348, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0349', N'공학계열(무기재료공학과)', N'8007', N'', N'', NULL, 349, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0350', N'공학계열(광학공학과)', N'8007', N'', N'', NULL, 351, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0351', N'공학계열(고분자공학과)', N'8007', N'', N'', NULL, 351, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0352', N'공학계열(멀티미디어공학과)', N'8007', N'', N'', NULL, 352, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0353', N'공학계열(조선공학과)', N'8007', N'', N'', NULL, 353, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0354', N'공학계열(항공운항학과)', N'8007', N'', N'', NULL, 354, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0355', N'공학계열(항공우주공학과)', N'8007', N'', N'', NULL, 355, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0356', N'공학계열(반도체공학과)', N'8007', N'', N'', NULL, 356, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0357', N'공학계열(화학공학과)', N'8007', N'', N'', NULL, 357, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0358', N'공학계열(공업화학과)', N'8007', N'', N'', NULL, 358, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0359', N'공학계열(건축공학과)', N'8007', N'', N'', NULL, 359, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0360', N'공학계열(지리정보공학과)', N'8007', N'', N'', NULL, 361, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0361', N'공학계열(도시공학과)', N'8007', N'', N'', NULL, 361, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0362', N'공학계열(토목공학과)', N'8007', N'', N'', NULL, 362, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0363', N'공학계열(환경공학과)', N'8007', N'', N'', NULL, 363, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0364', N'공학계열(보석공학과)', N'8007', N'', N'', NULL, 364, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0365', N'공학계열(사진정보공학과)', N'8007', N'', N'', NULL, 365, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0366', N'공학계열(기타)', N'8007', N'', N'', NULL, 366, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0367', N'농학계열(농학과)', N'8007', N'', N'', NULL, 367, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0368', N'농학계열(임학과)', N'8007', N'', N'', NULL, 368, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0369', N'농학계열(축산학과)', N'8007', N'', N'', NULL, 369, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0370', N'농학계열(농생물학과)', N'8007', N'', N'', NULL, 371, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0371', N'농학계열(식물자원학과)', N'8007', N'', N'', NULL, 371, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0372', N'농학계열(원예학과)', N'8007', N'', N'', NULL, 372, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0373', N'농학계열(임산공학과)', N'8007', N'', N'', NULL, 373, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0374', N'농학계열(천연섬유학과)', N'8007', N'', N'', NULL, 374, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0375', N'농학계열(조경학과)', N'8007', N'', N'', NULL, 375, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0376', N'농학계열(식량자원학과)', N'8007', N'', N'', NULL, 376, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0377', N'농학계열(식품공학과)', N'8007', N'', N'', NULL, 377, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0378', N'농학계열(기타)', N'8007', N'', N'', NULL, 378, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0379', N'수상해양계열(해양학과)', N'8007', N'', N'', NULL, 379, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0380', N'수상해양계열(해양경찰학과)', N'8007', N'', N'', NULL, 381, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0381', N'수상해양계열(해양환경공학과)', N'8007', N'', N'', NULL, 381, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0382', N'수상해양계열(해양생산학과)', N'8007', N'', N'', NULL, 382, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0383', N'수상해양계열(수산생명의학과)', N'8007', N'', N'', NULL, 383, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0384', N'수상해양계열(수산경영학과)', N'8007', N'', N'', NULL, 384, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0385', N'수상해양계열(수산가공학과)', N'8007', N'', N'', NULL, 385, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0386', N'수상해양계열(양식학과)', N'8007', N'', N'', NULL, 386, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0387', N'수상해양계열(항해시스템공학과)', N'8007', N'', N'', NULL, 387, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0388', N'수상해양계열(기관공학과)', N'8007', N'', N'', NULL, 388, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0389', N'수상해양계열(냉동공조공학과)', N'8007', N'', N'', NULL, 389, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0390', N'수상해양계열(기타)', N'8007', N'', N'', NULL, 391, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0391', N'가정계열(의류학과)', N'8007', N'', N'', NULL, 391, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0392', N'가정계열(패션디자인학과)', N'8007', N'', N'', NULL, 392, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0393', N'가정계열(아동가족학과)', N'8007', N'', N'', NULL, 393, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0394', N'가정계열(가정복지학과)', N'8007', N'', N'', NULL, 394, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0395', N'가정계열(아동복지학과)', N'8007', N'', N'', NULL, 395, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0396', N'가정계열(가정관리학과)', N'8007', N'', N'', NULL, 396, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0397', N'가정계열(보육학과)', N'8007', N'', N'', NULL, 397, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0398', N'가정계열(외식사업학과)', N'8007', N'', N'', NULL, 398, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0399', N'가정계열(영양자원학과)', N'8007', N'', N'', NULL, 399, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0400', N'가정계열(식품생명공학과)', N'8007', N'', N'', NULL, 401, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0401', N'가정계열(식품영양학과)', N'8007', N'', N'', NULL, 401, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0402', N'가정계열(식품가공학과)', N'8007', N'', N'', NULL, 402, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0403', N'가정계열(소비자학과)', N'8007', N'', N'', NULL, 403, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0404', N'가정계열(기타)', N'8007', N'', N'', NULL, 404, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0405', N'의학계열(한의학과)', N'8007', N'', N'', NULL, 405, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0406', N'의학계열(치의예과)', N'8007', N'', N'', NULL, 406, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0407', N'의학계열(내과)', N'8007', N'', N'', NULL, 407, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0408', N'의학계열(소아과)', N'8007', N'', N'', NULL, 408, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0409', N'의학계열(신경정신과)', N'8007', N'', N'', NULL, 409, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0410', N'의학계열(피부과)', N'8007', N'', N'', NULL, 411, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0411', N'의학계열((일반)외과)', N'8007', N'', N'', NULL, 411, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0412', N'의학계열(흉부외과)', N'8007', N'', N'', NULL, 412, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0413', N'의학계열(정형외과)', N'8007', N'', N'', NULL, 413, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0414', N'의학계열(신경외과)', N'8007', N'', N'', NULL, 414, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0415', N'의학계열(성형외과)', N'8007', N'', N'', NULL, 415, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0416', N'의학계열(산부인과)', N'8007', N'', N'', NULL, 416, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0417', N'의학계열(안과)', N'8007', N'', N'', NULL, 417, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0418', N'의학계열(이비인후과)', N'8007', N'', N'', NULL, 418, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0419', N'의학계열(비뇨기과)', N'8007', N'', N'', NULL, 419, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0420', N'의학계열(재활의학과)', N'8007', N'', N'', NULL, 421, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0421', N'의학계열(방사선종양학과)', N'8007', N'', N'', NULL, 421, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0422', N'의학계열(가정의학과)', N'8007', N'', N'', NULL, 422, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0423', N'의학계열(응급의학과)', N'8007', N'', N'', NULL, 423, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0424', N'의학계열(산업의학과)', N'8007', N'', N'', NULL, 424, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0425', N'의학계열(예방의학과)', N'8007', N'', N'', NULL, 425, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0426', N'의학계열(해부병리과)', N'8007', N'', N'', NULL, 426, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0427', N'의학계열(마취통증의학과)', N'8007', N'', N'', NULL, 427, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0428', N'의학계열(영상의학과(진단방사선과))', N'8007', N'', N'', NULL, 428, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0429', N'의학계열(진단검사의학과)', N'8007', N'', N'', NULL, 429, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0430', N'의학계열(핵의학과)', N'8007', N'', N'', NULL, 431, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0431', N'의학계열(조직병리학과)', N'8007', N'', N'', NULL, 431, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0432', N'의학계열(결핵과)', N'8007', N'', N'', NULL, 432, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0433', N'수의학계열(수의학과)', N'8007', N'', N'', NULL, 433, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0434', N'약학계열(약학과)', N'8007', N'', N'', NULL, 434, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0435', N'약학계열(한약학과)', N'8007', N'', N'', NULL, 435, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0436', N'의료보건계열(간호학과)', N'8007', N'', N'', NULL, 436, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0437', N'의료보건계열(물리치료학과)', N'8007', N'', N'', NULL, 437, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0438', N'의료보건계열(재활학과)', N'8007', N'', N'', NULL, 438, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0439', N'의료보건계열(건강관리학과)', N'8007', N'', N'', NULL, 439, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0440', N'의료보건계열(보건학과)', N'8007', N'', N'', NULL, 441, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0441', N'의료보건계열(임상병리학과)', N'8007', N'', N'', NULL, 441, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0442', N'의료보건계열(보건의료행정학과)', N'8007', N'', N'', NULL, 442, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0443', N'의료보건계열(직업재활학과)', N'8007', N'', N'', NULL, 443, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0444', N'의료보건계열(환경보건학과)', N'8007', N'', N'', NULL, 444, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0445', N'의료보건계열(안경광학과)', N'8007', N'', N'', NULL, 445, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0446', N'의료보건계열(미용학과)', N'8007', N'', N'', NULL, 446, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0447', N'의료보건계열(치기공학과)', N'8007', N'', N'', NULL, 447, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0448', N'의료보건계열(치위생학과)', N'8007', N'', N'', NULL, 448, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0449', N'의료보건계열(보건위생학과)', N'8007', N'', N'', NULL, 449, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0450', N'의료보건계열(응급구조학과)', N'8007', N'', N'', NULL, 451, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0451', N'의료보건계열(방사선학과)', N'8007', N'', N'', NULL, 451, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0452', N'의료보건계열(작업치료학과)', N'8007', N'', N'', NULL, 452, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0453', N'의료보건계열(의공학과)', N'8007', N'', N'', NULL, 453, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0454', N'의료보건계열(기타)', N'8007', N'', N'', NULL, 454, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0455', N'음악계열(음악학과)', N'8007', N'', N'', NULL, 455, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0456', N'음악계열(성악과)', N'8007', N'', N'', NULL, 456, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0457', N'음악계열(작곡과)', N'8007', N'', N'', NULL, 457, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0458', N'음악계열(국악과)', N'8007', N'', N'', NULL, 458, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0459', N'음악계열(기악과)', N'8007', N'', N'', NULL, 459, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0460', N'음악계열(피아노과)', N'8007', N'', N'', NULL, 461, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0461', N'음악계열(관현학과)', N'8007', N'', N'', NULL, 461, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0462', N'음악계열(실용음악과)', N'8007', N'', N'', NULL, 462, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0463', N'음악계열(한국음악과)', N'8007', N'', N'', NULL, 463, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0464', N'음악계열(영상음악과)', N'8007', N'', N'', NULL, 464, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0465', N'음악계열(교회음악학과)', N'8007', N'', N'', NULL, 465, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0466', N'음악계열(기타)', N'8007', N'', N'', NULL, 466, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0467', N'미술계열(회화학과)', N'8007', N'', N'', NULL, 467, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0468', N'미술계열(미술학과)', N'8007', N'', N'', NULL, 468, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0469', N'미술계열(동양화과)', N'8007', N'', N'', NULL, 469, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0470', N'미술계열(서양화과)', N'8007', N'', N'', NULL, 471, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0471', N'미술계열(공예학과)', N'8007', N'', N'', NULL, 471, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0472', N'미술계열(조소학과)', N'8007', N'', N'', NULL, 472, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0473', N'미술계열(도예과)', N'8007', N'', N'', NULL, 473, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0474', N'미술계열(응용미술학과)', N'8007', N'', N'', NULL, 474, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0475', N'미술계열(실내디자인학과)', N'8007', N'', N'', NULL, 475, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0476', N'미술계열(가구디자인과)', N'8007', N'', N'', NULL, 476, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0477', N'미술계열(산업디자인학과)', N'8007', N'', N'', NULL, 477, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0478', N'미술계열(멀티미디어디자인학과)', N'8007', N'', N'', NULL, 478, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0479', N'미술계열(컴퓨터그래픽디자인학과)', N'8007', N'', N'', NULL, 479, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0480', N'미술계열(공업디자인학과)', N'8007', N'', N'', NULL, 481, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0481', N'미술계열(사진학과)', N'8007', N'', N'', NULL, 481, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0482', N'미술계열(만화학과)', N'8007', N'', N'', NULL, 482, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0483', N'미술계열(미술평론학과)', N'8007', N'', N'', NULL, 483, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0484', N'미술계열(기타)', N'8007', N'', N'', NULL, 484, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0485', N'연극영화계열(연극영화학과)', N'8007', N'', N'', NULL, 485, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0486', N'연극영화계열(영상예술학과)', N'8007', N'', N'', NULL, 486, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0487', N'연극영화계열(기타)', N'8007', N'', N'', NULL, 487, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0488', N'무용체육계열(체육학과)', N'8007', N'', N'', NULL, 488, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0489', N'무용체육계열(바둑학과)', N'8007', N'', N'', NULL, 489, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0490', N'무용체육계열(무용학과)', N'8007', N'', N'', NULL, 491, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0491', N'무용체육계열(경호학과)', N'8007', N'', N'', NULL, 491, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0492', N'무용체육계열(기타)', N'8007', N'', N'', NULL, 492, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0493', N'사범계열(교육학과)', N'8007', N'', N'', NULL, 493, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0494', N'사범계열(사범대어문계학과)', N'8007', N'', N'', NULL, 494, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0495', N'사범계열(사범대인문사회학과)', N'8007', N'', N'', NULL, 495, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0496', N'사범계열(사범대이학계학과)', N'8007', N'', N'', NULL, 496, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0497', N'사범계열(사범대공학계학과)', N'8007', N'', N'', NULL, 497, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0498', N'사범계열(사범대예체능계학과)', N'8007', N'', N'', NULL, 498, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0499', N'사범계열(유아교육학과)', N'8007', N'', N'', NULL, 499, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0500', N'사범계열(초등교육학과)', N'8007', N'', N'', NULL, 501, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0501', N'사범계열(특수교육학과)', N'8007', N'', N'', NULL, 501, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0502', N'사범계열(기타)', N'8007', N'', N'', NULL, 502, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0503', N'대학 총장 및 부총장', N'8008', N'', N'', NULL, 503, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0504', N'기타 교직원', N'8008', N'', N'', NULL, 504, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0505', N'어학원강사(영어)', N'8009', N'', N'', NULL, 505, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0506', N'어학원강사(일어)', N'8009', N'', N'', NULL, 506, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0507', N'어학원강사(불어)', N'8009', N'', N'', NULL, 507, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0508', N'어학원강사(독어)', N'8009', N'', N'', NULL, 508, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0509', N'어학원강사(중국어)', N'8009', N'', N'', NULL, 509, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0510', N'어학원강사(기타언어)', N'8009', N'', N'', NULL, 511, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0511', N'예능학원강사(무용)', N'8009', N'', N'', NULL, 511, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0512', N'예능학원강사(성악)', N'8009', N'', N'', NULL, 512, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0513', N'예능학원강사(음악)', N'8009', N'', N'', NULL, 513, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0514', N'예능학원강사(기타예능)', N'8009', N'', N'', NULL, 514, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0515', N'컴퓨터학원강사', N'8009', N'', N'', NULL, 515, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0516', N'직업관련강사', N'8009', N'', N'', NULL, 516, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0517', N'플로리스트', N'8009', N'', N'', NULL, 517, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0518', N'요리강사', N'8009', N'', N'', NULL, 518, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0519', N'자동차운전학원강사', N'8009', N'', N'', NULL, 519, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0520', N'기술학원강사', N'8009', N'', N'', NULL, 521, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0521', N'사무학원강사', N'8009', N'', N'', NULL, 521, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0522', N'문리강사', N'8009', N'', N'', NULL, 522, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0523', N'체력훈련가', N'8009', N'', N'', NULL, 523, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0524', N'기타 학원강사', N'8009', N'', N'', NULL, 524, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0525', N'시각장애학교 교사', N'8010', N'', N'', NULL, 525, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0526', N'청각장애학교 교사', N'8010', N'', N'', NULL, 526, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0527', N'지체부자유학교 교사', N'8010', N'', N'', NULL, 527, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0528', N'정신장애학교 교사', N'8010', N'', N'', NULL, 528, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0529', N'기타 특수학교 교사', N'8010', N'', N'', NULL, 529, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0530', N'경영컨설턴트', N'9000', N'', N'', NULL, 531, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0531', N'헤드헌터', N'9000', N'', N'', NULL, 531, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0532', N'노무사', N'9000', N'', N'', NULL, 532, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0533', N'번역사', N'9000', N'', N'', NULL, 533, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0534', N'통역사', N'9000', N'', N'', NULL, 534, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0535', N'미술품 감정사', N'9000', N'', N'', NULL, 535, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0536', N'보석 감정사', N'9000', N'', N'', NULL, 536, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0537', N'평가사', N'9000', N'', N'', NULL, 537, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0538', N'경매사', N'9000', N'', N'', NULL, 538, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0539', N'공인중개사', N'9000', N'', N'', NULL, 539, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0540', N'부동산감정사', N'9000', N'', N'', NULL, 541, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0541', N'건축설계사', N'9000', N'', N'', NULL, 541, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0542', N'인테리어디자이너', N'9000', N'', N'', NULL, 542, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0543', N'패션디자이너', N'9000', N'', N'', NULL, 543, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0544', N'기타 전문직', N'9000', N'', N'', NULL, 544, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0545', N'리서치/시장분석', N'10000', N'', N'', NULL, 545, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0546', N'상품기획/개발/MD', N'10000', N'', N'', NULL, 546, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0547', N'인문학자(민속역사학자)', N'10000', N'', N'', NULL, 547, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0548', N'인문학자(언어학자)  ', N'10000', N'', N'', NULL, 548, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0549', N'인문학자(철학자)  ', N'10000', N'', N'', NULL, 549, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0550', N'기타 인문학자', N'10000', N'', N'', NULL, 551, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0551', N'자연과학자(농경학자)  ', N'10000', N'', N'', NULL, 551, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0552', N'자연과학자(축산학자)  ', N'10000', N'', N'', NULL, 552, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0553', N'자연과학자(동물학자)  ', N'10000', N'', N'', NULL, 553, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0554', N'자연과학자(동물병리학자)  ', N'10000', N'', N'', NULL, 554, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0555', N'자연과학자(병리학자)  ', N'10000', N'', N'', NULL, 555, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0556', N'자연과학자(물리학자)  ', N'10000', N'', N'', NULL, 556, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0557', N'자연과학자(생리학자)', N'10000', N'', N'', NULL, 557, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0558', N'자연과학자(의학자)  ', N'10000', N'', N'', NULL, 558, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0559', N'자연과학자(약학자)  ', N'10000', N'', N'', NULL, 559, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0560', N'자연과학자(산림학자)  ', N'10000', N'', N'', NULL, 561, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0561', N'자연과학자(생태학자)  ', N'10000', N'', N'', NULL, 561, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0562', N'자연과학자(식물학자)  ', N'10000', N'', N'', NULL, 562, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0563', N'자연과학자(원예학자)  ', N'10000', N'', N'', NULL, 563, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0564', N'자연과학자(유전학자)  ', N'10000', N'', N'', NULL, 564, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0565', N'자연과학자(생물학자)  ', N'10000', N'', N'', NULL, 565, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0566', N'자연과학자(화학자)  ', N'10000', N'', N'', NULL, 566, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0567', N'자연과학자(지구물리학자)  ', N'10000', N'', N'', NULL, 567, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0568', N'자연과학자(천문학자)  ', N'10000', N'', N'', NULL, 568, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0569', N'자연과학자(기상학자)  ', N'10000', N'', N'', NULL, 569, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0570', N'자연과학자(지질학자)  ', N'10000', N'', N'', NULL, 571, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0571', N'자연과학자(지리학자)  ', N'10000', N'', N'', NULL, 571, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0572', N'자연과학자(환경과학학자)  ', N'10000', N'', N'', NULL, 572, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0573', N'자연과학자(수학자)  ', N'10000', N'', N'', NULL, 573, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0574', N'자연과학자(통계학자)  ', N'10000', N'', N'', NULL, 574, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0575', N'기타 자연과학자', N'10000', N'', N'', NULL, 575, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0576', N'사회과학자(경영학자)  ', N'10000', N'', N'', NULL, 576, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0577', N'사회과학자(경제학자)  ', N'10000', N'', N'', NULL, 577, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0578', N'사회과학자(사회학자)  ', N'10000', N'', N'', NULL, 578, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0579', N'사회과학자(심리학자) ', N'10000', N'', N'', NULL, 579, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0580', N'사회과학자(정치학자) ', N'10000', N'', N'', NULL, 581, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0581', N'사회과학자(인류학자) ', N'10000', N'', N'', NULL, 581, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0582', N'기타 사회과학자', N'10000', N'', N'', NULL, 582, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0583', N'임원/간부/CEO/CIO', N'11000', N'', N'', NULL, 583, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0584', N'기획/전략기획/경영', N'11000', N'', N'', NULL, 584, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0585', N'총무/인사/공무/관리', N'11000', N'', N'', NULL, 585, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0586', N'경리/회계/재무/자금', N'11000', N'', N'', NULL, 586, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0587', N'홍보/PR/광고 ', N'11000', N'', N'', NULL, 587, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0588', N'고객상담/TM', N'11000', N'', N'', NULL, 588, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0589', N'구매/자재', N'11000', N'', N'', NULL, 589, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0590', N'비서/수행원', N'11000', N'', N'', NULL, 591, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0591', N'OA/전자문서편집', N'11000', N'', N'', NULL, 591, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0592', N'음식료업/지배인/서비스', N'11000', N'', N'', NULL, 592, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0593', N'유통/백화점/물류', N'11000', N'', N'', NULL, 593, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0594', N'무역/수출입사무직 ', N'11000', N'', N'', NULL, 594, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0595', N'기타(사무일반,관리직) ', N'11000', N'', N'', NULL, 595, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0596', N'증권분석사', N'12000', N'', N'', NULL, 596, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0597', N'자산설계사', N'12000', N'', N'', NULL, 597, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0598', N'외환/선물 딜러', N'12000', N'', N'', NULL, 598, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0599', N'회계사', N'12000', N'', N'', NULL, 599, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0600', N'세무사', N'12000', N'', N'', NULL, 601, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0601', N'관세사', N'12000', N'', N'', NULL, 601, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0602', N'리서치/시장분석/통계', N'12000', N'', N'', NULL, 602, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0603', N'상품기획/개발/MD', N'12000', N'', N'', NULL, 603, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0604', N'임원/간부/CEO/CIO', N'12000', N'', N'', NULL, 604, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0605', N'기획/전략기획/경영', N'12000', N'', N'', NULL, 605, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0606', N'총무/인사/공무/관리', N'12000', N'', N'', NULL, 606, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0607', N'경리/회계/재무/자금', N'12000', N'', N'', NULL, 607, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0608', N'홍보/PR/광고 ', N'12000', N'', N'', NULL, 608, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0609', N'고객상담/TM', N'12000', N'', N'', NULL, 609, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0610', N'구매/자재', N'12000', N'', N'', NULL, 611, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0611', N'비서/수행원', N'12000', N'', N'', NULL, 611, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0612', N'OA/전자문서편집', N'12000', N'', N'', NULL, 612, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0613', N'기타(사무일반,관리직) ', N'12000', N'', N'', NULL, 613, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0614', N'마케팅/마케팅기획 ', N'12000', N'', N'', NULL, 614, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0615', N'금융영업/보험영업 ', N'12000', N'', N'', NULL, 615, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0616', N'기타(마케팅/영업직) ', N'12000', N'', N'', NULL, 616, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0617', N'마케팅/마케팅기획 ', N'13000', N'', N'', NULL, 617, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0618', N'영업', N'13000', N'', N'', NULL, 618, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0619', N'판매/매장/고객관리 ', N'13000', N'', N'', NULL, 619, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0620', N'무역/해외영업/수출입 ', N'13000', N'', N'', NULL, 621, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0621', N'광고영업', N'13000', N'', N'', NULL, 621, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0622', N'기술영업(정보통신/SI)', N'13000', N'', N'', NULL, 622, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0623', N'기술영업(기타기술판매)', N'13000', N'', N'', NULL, 623, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0624', N'기타(마케팅/영업직) ', N'13000', N'', N'', NULL, 624, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0625', N'전기/전자/제어', N'14000', N'', N'', NULL, 625, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0626', N'반도체/디스플레이/광학', N'14000', N'', N'', NULL, 626, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0627', N'컴퓨터/하드웨어/장비', N'14000', N'', N'', NULL, 627, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0628', N'기계/기계설비 ', N'14000', N'', N'', NULL, 628, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0629', N'자동차/철강/조선/항공', N'14000', N'', N'', NULL, 629, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0630', N'금속/재료/요업 ', N'14000', N'', N'', NULL, 631, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0631', N'건설/토목 ', N'14000', N'', N'', NULL, 631, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0632', N'건축/설비/조경', N'14000', N'', N'', NULL, 632, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0633', N'화학/에너지/프라스틱/환경', N'14000', N'', N'', NULL, 633, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0634', N'섬유/의류/패션', N'14000', N'', N'', NULL, 634, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0635', N'제약/의료/바이오', N'14000', N'', N'', NULL, 635, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0636', N'생활화학/화장품 ', N'14000', N'', N'', NULL, 636, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0637', N'목재/제지/가구', N'14000', N'', N'', NULL, 637, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0638', N'소비재/기타제조', N'14000', N'', N'', NULL, 638, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0639', N'식품가공/농어업/광업', N'14000', N'', N'', NULL, 639, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0640', N'생산관리/공정관리/품질관리', N'14000', N'', N'', NULL, 641, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0641', N'생산/조립/기능직', N'14000', N'', N'', NULL, 641, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0642', N'기타 기술/기능직종', N'14000', N'', N'', NULL, 642, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0643', N'총지배인', N'15001', N'', N'', NULL, 643, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0644', N'식음료서비스 종사자', N'15001', N'', N'', NULL, 644, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0645', N'연회서비스 종사자', N'15001', N'', N'', NULL, 645, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0646', N'조리사', N'15001', N'', N'', NULL, 646, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0647', N'프론트서비스 종사자', N'15001', N'', N'', NULL, 647, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0648', N'벨,도어서비스 종사자', N'15001', N'', N'', NULL, 648, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0649', N'하우스키핑,린넨', N'15001', N'', N'', NULL, 649, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0650', N'면세 영업 종사자', N'15001', N'', N'', NULL, 651, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0651', N'휘트니스', N'15001', N'', N'', NULL, 651, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0652', N'고객지원 종사자', N'15001', N'', N'', NULL, 652, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0653', N'기타 호텔/숙박 서비스업 종사자', N'15001', N'', N'', NULL, 653, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0654', N'조리사', N'15002', N'', N'', NULL, 654, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0655', N'바텐더', N'15002', N'', N'', NULL, 655, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0656', N'주류서비스업 종사자', N'15002', N'', N'', NULL, 656, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0657', N'음료서비스업 종사자', N'15002', N'', N'', NULL, 657, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0658', N'음식업서비스업 종사자', N'15002', N'', N'', NULL, 658, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0659', N'기타 음식/외식 서비스업 종사자', N'15002', N'', N'', NULL, 659, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0660', N'항공기승무원', N'15003', N'', N'', NULL, 661, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0661', N'여객열차승무원', N'15003', N'', N'', NULL, 661, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0662', N'선박승무원', N'15003', N'', N'', NULL, 662, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0663', N'기타승무원', N'15003', N'', N'', NULL, 663, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0664', N'선장', N'15003', N'', N'', NULL, 664, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0665', N'파일럿', N'15003', N'', N'', NULL, 665, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0666', N'기관사', N'15003', N'', N'', NULL, 666, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0667', N'운전직(지입/운송/화물) ', N'15003', N'', N'', NULL, 667, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0668', N'운전직(중장비/중기계) ', N'15003', N'', N'', NULL, 668, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0669', N'기타운전직(택시/개인/버스)', N'15003', N'', N'', NULL, 669, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0670', N'기타 운전/운항 서비스업 종사자', N'15003', N'', N'', NULL, 671, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0671', N'여행가이드', N'15004', N'', N'', NULL, 671, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0672', N'기타 여행서비스업 종사자', N'15004', N'', N'', NULL, 672, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0673', N'미용사', N'15005', N'', N'', NULL, 673, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0674', N'피부관리사', N'15005', N'', N'', NULL, 674, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0675', N'화장 및 분장사', N'15005', N'', N'', NULL, 675, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0676', N'코디네이터', N'15005', N'', N'', NULL, 676, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0677', N'기타 미용서비스업 종사자', N'15005', N'', N'', NULL, 677, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0678', N'결혼상담원', N'15006', N'', N'', NULL, 678, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0679', N'예식종사원', N'15006', N'', N'', NULL, 679, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0680', N'공연기획', N'15006', N'', N'', NULL, 681, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0681', N'행사도우미', N'15006', N'', N'', NULL, 681, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0682', N'나레이터', N'15006', N'', N'', NULL, 682, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0683', N'기타 결혼/행사 서비스업 종사자', N'15006', N'', N'', NULL, 683, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0684', N'경호원', N'15007', N'', N'', NULL, 684, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0685', N'청원경찰', N'15007', N'', N'', NULL, 685, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0686', N'경비/시설관리/주차관리', N'15007', N'', N'', NULL, 686, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0687', N'기타 경비/보안서비스업 종사자', N'15007', N'', N'', NULL, 687, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0688', N'장의사', N'15008', N'', N'', NULL, 688, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0689', N'기타 장의관련 서비스업 종사자', N'15008', N'', N'', NULL, 689, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0690', N'가정보육사', N'15009', N'', N'', NULL, 691, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0691', N'간병인', N'15009', N'', N'', NULL, 691, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0692', N'기타 건강관련 서비스업 종사자', N'15009', N'', N'', NULL, 692, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0693', N'레크레이션 지도자', N'15010', N'', N'', NULL, 693, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0694', N'기타 오락 서비스업 종사자', N'15010', N'', N'', NULL, 694, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0695', N'안내/도우미/전화안내 ', N'15011', N'', N'', NULL, 695, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0696', N'사서', N'15011', N'', N'', NULL, 696, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0697', N'기타 안내 서비스업 종사자', N'15011', N'', N'', NULL, 697, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0698', N'웹마스터/몰마스터 ', N'16000', N'', N'', NULL, 698, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0699', N'네트웍/DB설계,구축', N'16000', N'', N'', NULL, 699, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0700', N'웹기획/마케팅/웹PD ', N'16000', N'', N'', NULL, 701, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0701', N'웹프로그래머', N'16000', N'', N'', NULL, 701, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0702', N'게임기획/개발', N'16000', N'', N'', NULL, 702, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0703', N'컨텐츠관리/정보제공', N'16000', N'', N'', NULL, 703, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0704', N'응용프로그래머', N'16000', N'', N'', NULL, 704, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0705', N'시스템/서버관리', N'16000', N'', N'', NULL, 705, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0706', N'시스템분석/설계/PM ', N'16000', N'', N'', NULL, 706, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0707', N'통신기술/GIS/GPS', N'16000', N'', N'', NULL, 707, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0708', N'하드웨어/장비개발', N'16000', N'', N'', NULL, 708, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0709', N'웹디자인/HTML코딩', N'16000', N'', N'', NULL, 709, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0710', N'그래픽/컴퓨터그래픽', N'16000', N'', N'', NULL, 711, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0711', N'편집디자인/MAC/광고', N'16000', N'', N'', NULL, 711, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0712', N'제품/산업디자인', N'16000', N'', N'', NULL, 712, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0713', N'CAD/CAM (355) ', N'16000', N'', N'', NULL, 713, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0714', N'캐릭터/애니메이션/CI', N'16000', N'', N'', NULL, 714, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0715', N'기타(IT/정보통신업)', N'16000', N'', N'', NULL, 715, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0716', N'농업', N'17000', N'', N'', NULL, 716, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0717', N'임업', N'17000', N'', N'', NULL, 717, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0718', N'광업', N'17000', N'', N'', NULL, 718, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0719', N'어업', N'17000', N'', N'', NULL, 719, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0720', N'축산업', N'17000', N'', N'', NULL, 721, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0721', N'기타', N'17000', N'', N'', NULL, 721, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0722', N'광고', N'18001', N'', N'', NULL, 722, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0723', N'방송/언론/미디어', N'18001', N'', N'', NULL, 723, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0724', N'은행/보험/증권/카드', N'18001', N'', N'', NULL, 724, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0725', N'연구소/컨설팅 ', N'18001', N'', N'', NULL, 725, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0726', N'출판/인쇄/편집/사진 ', N'18001', N'', N'', NULL, 726, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0727', N'교육/학원 ', N'18001', N'', N'', NULL, 727, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0728', N'호텔/관광/여행/항공', N'18001', N'', N'', NULL, 728, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0729', N'음식료업/프랜차이즈', N'18001', N'', N'', NULL, 729, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0730', N'유통/물류/무역 ', N'18001', N'', N'', NULL, 731, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0731', N'경비/시설관리/용역', N'18001', N'', N'', NULL, 731, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0732', N'환경/안전/보건직', N'18001', N'', N'', NULL, 732, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0733', N'기타 서비스업', N'18001', N'', N'', NULL, 733, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0734', N'전기/전자/반도체/광학', N'18002', N'', N'', NULL, 734, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0735', N'기계/철강/자동차', N'18002', N'', N'', NULL, 735, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0736', N'건설/토목/건축', N'18002', N'', N'', NULL, 736, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0737', N'석유/화학/에너지/환경', N'18002', N'', N'', NULL, 737, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0738', N'섬유/의류/쥬얼리/잡화', N'18002', N'', N'', NULL, 738, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0739', N'건강/의료/제약/유전 ', N'18002', N'', N'', NULL, 739, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0740', N'생활화학/화장품 ', N'18002', N'', N'', NULL, 741, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0741', N'소비재/기타제조업', N'18002', N'', N'', NULL, 741, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0742', N'목재/제지', N'18002', N'', N'', NULL, 742, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0743', N'농어업/광업/임업/식품', N'18002', N'', N'', NULL, 743, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0744', N'금속/재료/요업', N'18002', N'', N'', NULL, 744, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0745', N'조선/항공/우주', N'18002', N'', N'', NULL, 745, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0746', N'기타 제조업종', N'18002', N'', N'', NULL, 746, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0747', N'웹에이젼시', N'18003', N'', N'', NULL, 747, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0748', N'솔루션/ASP ', N'18003', N'', N'', NULL, 748, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0749', N'전자상거래/EC', N'18003', N'', N'', NULL, 749, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0750', N'포털/컨텐츠', N'18003', N'', N'', NULL, 751, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0751', N'네트웍/통신/텔레콤', N'18003', N'', N'', NULL, 751, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0752', N'하드웨어/장비 ', N'18003', N'', N'', NULL, 752, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0753', N'보안', N'18003', N'', N'', NULL, 753, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0754', N'게임/엔터테인먼트', N'18003', N'', N'', NULL, 754, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0755', N'캐릭터/애니메이션', N'18003', N'', N'', NULL, 755, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0756', N'모바일/무선', N'18003', N'', N'', NULL, 756, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0757', N'디자인/CAD', N'18003', N'', N'', NULL, 757, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0758', N'IT컨설팅/인큐베이팅', N'18003', N'', N'', NULL, 758, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0759', N'기타 정보통신업종', N'18003', N'', N'', NULL, 759, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0760', N'초등학생', N'19001', N'', N'', NULL, 761, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0761', N'중학생', N'19002', N'', N'', NULL, 761, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0762', N'고등학생', N'19003', N'', N'', NULL, 762, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0763', N'어문계열(언어학과)', N'19004', N'', N'', NULL, 763, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0764', N'어문계열(국어국문학과)', N'19004', N'', N'', NULL, 764, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0765', N'어문계열(영어영문학과)', N'19004', N'', N'', NULL, 765, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0766', N'어문계열(중어중문학과)', N'19004', N'', N'', NULL, 766, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0767', N'어문계열(일어일문학과)', N'19004', N'', N'', NULL, 767, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0768', N'어문계열(불어불문학과)', N'19004', N'', N'', NULL, 768, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0769', N'어문계열(독어독문학과)', N'19004', N'', N'', NULL, 769, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0770', N'어문계열(이태리어과)', N'19004', N'', N'', NULL, 771, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0771', N'어문계열(네덜란드어과)', N'19004', N'', N'', NULL, 771, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0772', N'어문계열(폴란드어과)', N'19004', N'', N'', NULL, 772, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0773', N'어문계열(포르투칼어과)', N'19004', N'', N'', NULL, 773, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0774', N'어문계열(체코어과)', N'19004', N'', N'', NULL, 774, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0775', N'어문계열(루마니아어과)', N'19004', N'', N'', NULL, 775, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0776', N'어문계열(헝가리어과)', N'19004', N'', N'', NULL, 776, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0777', N'어문계열(노어노문학과)', N'19004', N'', N'', NULL, 777, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0778', N'어문계열(서어서문학과)', N'19004', N'', N'', NULL, 778, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0779', N'어문계열(베트남어과)', N'19004', N'', N'', NULL, 779, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0780', N'어문계열(태국어과)', N'19004', N'', N'', NULL, 781, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0781', N'어문계열(말레이인도네시아어과)', N'19004', N'', N'', NULL, 781, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0782', N'어문계열(아랍어과)', N'19004', N'', N'', NULL, 782, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0783', N'어문계열(이란어과)', N'19004', N'', N'', NULL, 783, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0784', N'어문계열(몽골어문학과)', N'19004', N'', N'', NULL, 784, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0785', N'어문계열(미얀마어과)', N'19004', N'', N'', NULL, 785, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0786', N'어문계열(스칸디나비아어과)', N'19004', N'', N'', NULL, 786, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0787', N'어문계열(아프리카어과)', N'19004', N'', N'', NULL, 787, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0788', N'어문계열(유고어과)', N'19004', N'', N'', NULL, 788, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0789', N'어문계열(터어키어과)', N'19004', N'', N'', NULL, 789, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0790', N'어문계열(인도어과)', N'19004', N'', N'', NULL, 791, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0791', N'어문계열(중앙아시아어과)', N'19004', N'', N'', NULL, 791, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0792', N'어문계열(한문학과)', N'19004', N'', N'', NULL, 792, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0793', N'어문계열(통번역학과)', N'19004', N'', N'', NULL, 793, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0794', N'어문계열(기타)', N'19004', N'', N'', NULL, 794, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0795', N'인문계열(고고인류학과)', N'19004', N'', N'', NULL, 795, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0796', N'인문계열(문예창작학과)', N'19004', N'', N'', NULL, 796, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0797', N'인문계열(국민윤리학과)', N'19004', N'', N'', NULL, 797, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0798', N'인문계열(미국학과)', N'19004', N'', N'', NULL, 798, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0799', N'인문계열(영미지역학과)', N'19004', N'', N'', NULL, 799, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0800', N'인문계열(북미학과)', N'19004', N'', N'', NULL, 801, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0801', N'인문계열(유럽학과)', N'19004', N'', N'', NULL, 801, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0802', N'인문계열(프랑스학과)', N'19004', N'', N'', NULL, 802, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0803', N'인문계열(독일학과)', N'19004', N'', N'', NULL, 803, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0804', N'인문계열(러시아학과)', N'19004', N'', N'', NULL, 804, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0805', N'인문계열(아랍학과)', N'19004', N'', N'', NULL, 805, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0806', N'인문계열(히브리학과)', N'19004', N'', N'', NULL, 806, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0807', N'인문계열(아시아지역학과)', N'19004', N'', N'', NULL, 807, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0808', N'인문계열(중국학과)', N'19004', N'', N'', NULL, 808, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0809', N'인문계열(일본학과)', N'19004', N'', N'', NULL, 809, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0810', N'인문계열(한국학과)', N'19004', N'', N'', NULL, 811, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0811', N'인문계열(민속학과)', N'19004', N'', N'', NULL, 811, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0812', N'인문계열(미학과)', N'19004', N'', N'', NULL, 812, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0813', N'인문계열(사학과)', N'19004', N'', N'', NULL, 813, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0814', N'인문계열(철학과)', N'19004', N'', N'', NULL, 814, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0815', N'인문계열(기타)', N'19004', N'', N'', NULL, 815, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0816', N'신학계열(종교학과)', N'19004', N'', N'', NULL, 816, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0817', N'신학계열(신학과)', N'19004', N'', N'', NULL, 817, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0818', N'신학계열(기독교학과)', N'19004', N'', N'', NULL, 818, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0819', N'신학계열(불교학과)', N'19004', N'', N'', NULL, 819, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0820', N'신학계열(기타)', N'19004', N'', N'', NULL, 821, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0821', N'사회계열(광고홍보학과)', N'19004', N'', N'', NULL, 821, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0822', N'사회계열(언론정보학과)', N'19004', N'', N'', NULL, 822, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0823', N'사회계열(신문방송학과)', N'19004', N'', N'', NULL, 823, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0824', N'사회계열(국제문화정보학과)', N'19004', N'', N'', NULL, 824, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0825', N'사회계열(심리학과)', N'19004', N'', N'', NULL, 825, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0826', N'사회계열(아동학과)', N'19004', N'', N'', NULL, 826, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0827', N'사회계열(노년학과)', N'19004', N'', N'', NULL, 827, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0828', N'사회계열(사회학과)', N'19004', N'', N'', NULL, 828, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0829', N'사회계열(북한학과)', N'19004', N'', N'', NULL, 829, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0830', N'사회계열(부동산학과)', N'19004', N'', N'', NULL, 831, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0831', N'사회계열(지리학과)', N'19004', N'', N'', NULL, 831, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0832', N'사회계열(지적학과)', N'19004', N'', N'', NULL, 832, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0833', N'사회계열(풍수지리학과)', N'19004', N'', N'', NULL, 833, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0834', N'사회계열(문화재보존학과)', N'19004', N'', N'', NULL, 834, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0835', N'사회계열(지역사회개발학과)', N'19004', N'', N'', NULL, 835, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0836', N'사회계열(사회복지학과)', N'19004', N'', N'', NULL, 836, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0837', N'사회계열(사회사업학과)', N'19004', N'', N'', NULL, 837, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0838', N'사회계열(문헌정보학과)', N'19004', N'', N'', NULL, 838, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0839', N'사회계열(도서관학과)', N'19004', N'', N'', NULL, 839, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0840', N'사회계열(청소년지도학과)', N'19004', N'', N'', NULL, 841, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0841', N'사회계열(기타)', N'19004', N'', N'', NULL, 841, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0842', N'법정계열(법학과)', N'19004', N'', N'', NULL, 842, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0843', N'법정계열(국제법무학과)', N'19004', N'', N'', NULL, 843, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0844', N'법정계열(정치외교학과)', N'19004', N'', N'', NULL, 844, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0845', N'법정계열(행정학과)', N'19004', N'', N'', NULL, 845, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0846', N'법정계열(경찰행정학과)', N'19004', N'', N'', NULL, 846, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0847', N'법정계열(기타)', N'19004', N'', N'', NULL, 847, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0848', N'경상계열(경영학과)', N'19004', N'', N'', NULL, 848, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0849', N'경상계열(경제학과)', N'19004', N'', N'', NULL, 849, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0850', N'경상계열(무역학과)', N'19004', N'', N'', NULL, 851, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0851', N'경상계열(경영정보학과)', N'19004', N'', N'', NULL, 851, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0852', N'경상계열(국제경영학과)', N'19004', N'', N'', NULL, 852, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0853', N'경상계열(국제무역학과)', N'19004', N'', N'', NULL, 853, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0854', N'경상계열(국제통상학과)', N'19004', N'', N'', NULL, 854, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0855', N'경상계열(관광경영학과)', N'19004', N'', N'', NULL, 855, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0856', N'경상계열(관광통역학과)', N'19004', N'', N'', NULL, 856, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0857', N'경상계열(호텔경영학과)', N'19004', N'', N'', NULL, 857, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0858', N'경상계열(회계학과)', N'19004', N'', N'', NULL, 858, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0859', N'경상계열(비서학과)', N'19004', N'', N'', NULL, 859, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0860', N'경상계열(보험학과)', N'19004', N'', N'', NULL, 861, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0861', N'경상계열(유통정보학과)', N'19004', N'', N'', NULL, 861, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0862', N'경상계열(의료경영학과)', N'19004', N'', N'', NULL, 862, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0863', N'경상계열(창업정보학과)', N'19004', N'', N'', NULL, 863, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0864', N'경상계열(기타)', N'19004', N'', N'', NULL, 864, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0865', N'수학계열(수학과)', N'19004', N'', N'', NULL, 865, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0866', N'수학계열(통계학과)', N'19004', N'', N'', NULL, 866, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0867', N'수학계열(기타)', N'19004', N'', N'', NULL, 867, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0868', N'자연과학계열(화학과)', N'19004', N'', N'', NULL, 868, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0869', N'자연과학계열(물리학과)', N'19004', N'', N'', NULL, 869, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0870', N'자연과학계열(생물학과)', N'19004', N'', N'', NULL, 871, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0871', N'자연과학계열(천문학과)', N'19004', N'', N'', NULL, 871, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0872', N'자연과학계열(지질학과)', N'19004', N'', N'', NULL, 872, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0873', N'자연과학계열(지구과학과)', N'19004', N'', N'', NULL, 873, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0874', N'자연과학계열(생명과학과)', N'19004', N'', N'', NULL, 874, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0875', N'자연과학계열(지구환경학과)', N'19004', N'', N'', NULL, 875, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0876', N'자연과학계열(대기환경학과)', N'19004', N'', N'', NULL, 876, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0877', N'자연과학계열(항공교통학과)', N'19004', N'', N'', NULL, 877, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0878', N'자연과학계열(응용생명환경학과)', N'19004', N'', N'', NULL, 878, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0879', N'자연과학계열(분자생물학과)', N'19004', N'', N'', NULL, 879, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0880', N'자연과학계열(유전공학과)', N'19004', N'', N'', NULL, 881, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0881', N'자연과학계열(동물자원학과)', N'19004', N'', N'', NULL, 881, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0882', N'자연과학계열(기타)', N'19004', N'', N'', NULL, 882, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0883', N'공학계열(전기공학과)', N'19004', N'', N'', NULL, 883, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0884', N'공학계열(전자공학과)', N'19004', N'', N'', NULL, 884, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0885', N'공학계열(전자통신공학과)', N'19004', N'', N'', NULL, 885, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0886', N'공학계열(전자재료공학과)', N'19004', N'', N'', NULL, 886, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0887', N'공학계열(정보시스템공학과)', N'19004', N'', N'', NULL, 887, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0888', N'공학계열(제어계측공학과)', N'19004', N'', N'', NULL, 888, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0889', N'공학계열(기계공학과)', N'19004', N'', N'', NULL, 889, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0890', N'공학계열(정보통신공학과)', N'19004', N'', N'', NULL, 891, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0891', N'공학계열(정보처리공학과)', N'19004', N'', N'', NULL, 891, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0892', N'공학계열(금속공학과)', N'19004', N'', N'', NULL, 892, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0893', N'공학계열(재료공학과)', N'19004', N'', N'', NULL, 893, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0894', N'공학계열(자원공학과)', N'19004', N'', N'', NULL, 894, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0895', N'공학계열(원자력공학과)', N'19004', N'', N'', NULL, 895, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0896', N'공학계열(신소재공학과)', N'19004', N'', N'', NULL, 896, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0897', N'공학계열(세라믹공학과)', N'19004', N'', N'', NULL, 897, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0898', N'공학계열(섬유공학과)', N'19004', N'', N'', NULL, 898, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0899', N'공학계열(생산가공공학과)', N'19004', N'', N'', NULL, 899, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0900', N'공학계열(산업공학과)', N'19004', N'', N'', NULL, 901, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0901', N'공학계열(컴퓨터공학과)', N'19004', N'', N'', NULL, 901, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0902', N'공학계열(메카트로닉스공학과)', N'19004', N'', N'', NULL, 902, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0903', N'공학계열(무기재료공학과)', N'19004', N'', N'', NULL, 903, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0904', N'공학계열(광학공학과)', N'19004', N'', N'', NULL, 904, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0905', N'공학계열(고분자공학과)', N'19004', N'', N'', NULL, 905, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0906', N'공학계열(멀티미디어공학과)', N'19004', N'', N'', NULL, 906, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0907', N'공학계열(조선공학과)', N'19004', N'', N'', NULL, 907, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0908', N'공학계열(항공운항학과)', N'19004', N'', N'', NULL, 908, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0909', N'공학계열(항공우주공학과)', N'19004', N'', N'', NULL, 909, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0910', N'공학계열(반도체공학과)', N'19004', N'', N'', NULL, 911, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0911', N'공학계열(화학공학과)', N'19004', N'', N'', NULL, 911, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0912', N'공학계열(공업화학과)', N'19004', N'', N'', NULL, 912, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0913', N'공학계열(건축공학과)', N'19004', N'', N'', NULL, 913, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0914', N'공학계열(지리정보공학과)', N'19004', N'', N'', NULL, 914, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0915', N'공학계열(도시공학과)', N'19004', N'', N'', NULL, 915, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0916', N'공학계열(토목공학과)', N'19004', N'', N'', NULL, 916, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0917', N'공학계열(환경공학과)', N'19004', N'', N'', NULL, 917, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0918', N'공학계열(보석공학과)', N'19004', N'', N'', NULL, 918, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0919', N'공학계열(사진정보공학과)', N'19004', N'', N'', NULL, 919, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0920', N'공학계열(기타)', N'19004', N'', N'', NULL, 921, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0921', N'농학계열(농학과)', N'19004', N'', N'', NULL, 921, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0922', N'농학계열(임학과)', N'19004', N'', N'', NULL, 922, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0923', N'농학계열(축산학과)', N'19004', N'', N'', NULL, 923, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0924', N'농학계열(농생물학과)', N'19004', N'', N'', NULL, 924, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0925', N'농학계열(식물자원학과)', N'19004', N'', N'', NULL, 925, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0926', N'농학계열(원예학과)', N'19004', N'', N'', NULL, 926, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0927', N'농학계열(임산공학과)', N'19004', N'', N'', NULL, 927, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0928', N'농학계열(천연섬유학과)', N'19004', N'', N'', NULL, 928, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0929', N'농학계열(조경학과)', N'19004', N'', N'', NULL, 929, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0930', N'농학계열(식량자원학과)', N'19004', N'', N'', NULL, 931, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0931', N'농학계열(식품공학과)', N'19004', N'', N'', NULL, 931, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0932', N'농학계열(기타)', N'19004', N'', N'', NULL, 932, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0933', N'수상해양계열(해양학과)', N'19004', N'', N'', NULL, 933, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0934', N'수상해양계열(해양경찰학과)', N'19004', N'', N'', NULL, 934, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0935', N'수상해양계열(해양환경공학과)', N'19004', N'', N'', NULL, 935, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0936', N'수상해양계열(해양생산학과)', N'19004', N'', N'', NULL, 936, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0937', N'수상해양계열(수산생명의학과)', N'19004', N'', N'', NULL, 937, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0938', N'수상해양계열(수산경영학과)', N'19004', N'', N'', NULL, 938, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0939', N'수상해양계열(수산가공학과)', N'19004', N'', N'', NULL, 939, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0940', N'수상해양계열(양식학과)', N'19004', N'', N'', NULL, 941, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0941', N'수상해양계열(항해시스템공학과)', N'19004', N'', N'', NULL, 941, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0942', N'수상해양계열(기관공학과)', N'19004', N'', N'', NULL, 942, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0943', N'수상해양계열(냉동공조공학과)', N'19004', N'', N'', NULL, 943, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0944', N'수상해양계열(기타)', N'19004', N'', N'', NULL, 944, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0945', N'가정계열(의류학과)', N'19004', N'', N'', NULL, 945, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0946', N'가정계열(패션디자인학과)', N'19004', N'', N'', NULL, 946, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0947', N'가정계열(아동가족학과)', N'19004', N'', N'', NULL, 947, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0948', N'가정계열(가정복지학과)', N'19004', N'', N'', NULL, 948, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0949', N'가정계열(아동복지학과)', N'19004', N'', N'', NULL, 949, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0950', N'가정계열(가정관리학과)', N'19004', N'', N'', NULL, 951, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0951', N'가정계열(보육학과)', N'19004', N'', N'', NULL, 951, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0952', N'가정계열(외식사업학과)', N'19004', N'', N'', NULL, 952, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0953', N'가정계열(영양자원학과)', N'19004', N'', N'', NULL, 953, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0954', N'가정계열(식품생명공학과)', N'19004', N'', N'', NULL, 954, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0955', N'가정계열(식품영양학과)', N'19004', N'', N'', NULL, 955, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0956', N'가정계열(식품가공학과)', N'19004', N'', N'', NULL, 956, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0957', N'가정계열(소비자학과)', N'19004', N'', N'', NULL, 957, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0958', N'가정계열(기타)', N'19004', N'', N'', NULL, 958, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0959', N'의학계열(한의학과)', N'19004', N'', N'', NULL, 959, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0960', N'의학계열(치의예과)', N'19004', N'', N'', NULL, 961, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0961', N'의학계열(내과)', N'19004', N'', N'', NULL, 961, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0962', N'의학계열(소아과)', N'19004', N'', N'', NULL, 962, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0963', N'의학계열(신경정신과)', N'19004', N'', N'', NULL, 963, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0964', N'의학계열(피부과)', N'19004', N'', N'', NULL, 964, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0965', N'의학계열((일반)외과)', N'19004', N'', N'', NULL, 965, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0966', N'의학계열(흉부외과)', N'19004', N'', N'', NULL, 966, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0967', N'의학계열(정형외과)', N'19004', N'', N'', NULL, 967, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0968', N'의학계열(신경외과)', N'19004', N'', N'', NULL, 968, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0969', N'의학계열(성형외과)', N'19004', N'', N'', NULL, 969, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0970', N'의학계열(산부인과)', N'19004', N'', N'', NULL, 971, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0971', N'의학계열(안과)', N'19004', N'', N'', NULL, 971, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0972', N'의학계열(이비인후과)', N'19004', N'', N'', NULL, 972, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0973', N'의학계열(비뇨기과)', N'19004', N'', N'', NULL, 973, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0974', N'의학계열(재활의학과)', N'19004', N'', N'', NULL, 974, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0975', N'의학계열(방사선종양학과)', N'19004', N'', N'', NULL, 975, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0976', N'의학계열(가정의학과)', N'19004', N'', N'', NULL, 976, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0977', N'의학계열(응급의학과)', N'19004', N'', N'', NULL, 977, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0978', N'의학계열(산업의학과)', N'19004', N'', N'', NULL, 978, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0979', N'의학계열(예방의학과)', N'19004', N'', N'', NULL, 979, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0980', N'의학계열(해부병리과)', N'19004', N'', N'', NULL, 981, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0981', N'의학계열(마취통증의학과)', N'19004', N'', N'', NULL, 981, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0982', N'의학계열(영상의학과(진단방사선과))', N'19004', N'', N'', NULL, 982, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0983', N'의학계열(진단검사의학과)', N'19004', N'', N'', NULL, 983, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0984', N'의학계열(핵의학과)', N'19004', N'', N'', NULL, 984, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0985', N'의학계열(조직병리학과)', N'19004', N'', N'', NULL, 985, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0986', N'의학계열(결핵과)', N'19004', N'', N'', NULL, 986, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0987', N'수의학계열(수의학과)', N'19004', N'', N'', NULL, 987, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0988', N'약학계열(약학과)', N'19004', N'', N'', NULL, 988, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0989', N'약학계열(한약학과)', N'19004', N'', N'', NULL, 989, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0990', N'의료보건계열(간호학과)', N'19004', N'', N'', NULL, 991, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0991', N'의료보건계열(물리치료학과)', N'19004', N'', N'', NULL, 991, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0992', N'의료보건계열(재활학과)', N'19004', N'', N'', NULL, 992, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0993', N'의료보건계열(건강관리학과)', N'19004', N'', N'', NULL, 993, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0994', N'의료보건계열(보건학과)', N'19004', N'', N'', NULL, 994, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0995', N'의료보건계열(임상병리학과)', N'19004', N'', N'', NULL, 995, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0996', N'의료보건계열(보건의료행정학과)', N'19004', N'', N'', NULL, 996, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0997', N'의료보건계열(직업재활학과)', N'19004', N'', N'', NULL, 997, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0998', N'의료보건계열(환경보건학과)', N'19004', N'', N'', NULL, 998, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'0999', N'의료보건계열(안경광학과)', N'19004', N'', N'', NULL, 999, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1000', N'의료보건계열(미용학과)', N'19004', N'', N'', NULL, 1001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1001', N'의료보건계열(치기공학과)', N'19004', N'', N'', NULL, 1001, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1002', N'의료보건계열(치위생학과)', N'19004', N'', N'', NULL, 1002, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1003', N'의료보건계열(보건위생학과)', N'19004', N'', N'', NULL, 1003, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1004', N'의료보건계열(응급구조학과)', N'19004', N'', N'', NULL, 1004, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1005', N'의료보건계열(방사선학과)', N'19004', N'', N'', NULL, 1005, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1006', N'의료보건계열(작업치료학과)', N'19004', N'', N'', NULL, 1006, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1007', N'의료보건계열(의공학과)', N'19004', N'', N'', NULL, 1007, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1008', N'의료보건계열(기타)', N'19004', N'', N'', NULL, 1008, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1009', N'음악계열(음악학과)', N'19004', N'', N'', NULL, 1009, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1010', N'음악계열(성악과)', N'19004', N'', N'', NULL, 1011, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1011', N'음악계열(작곡과)', N'19004', N'', N'', NULL, 1011, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1012', N'음악계열(국악과)', N'19004', N'', N'', NULL, 1012, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1013', N'음악계열(기악과)', N'19004', N'', N'', NULL, 1013, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1014', N'음악계열(피아노과)', N'19004', N'', N'', NULL, 1014, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1015', N'음악계열(관현학과)', N'19004', N'', N'', NULL, 1015, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1016', N'음악계열(실용음악과)', N'19004', N'', N'', NULL, 1016, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1017', N'음악계열(한국음악과)', N'19004', N'', N'', NULL, 1017, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1018', N'음악계열(영상음악과)', N'19004', N'', N'', NULL, 1018, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1019', N'음악계열(교회음악학과)', N'19004', N'', N'', NULL, 1019, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1020', N'음악계열(기타)', N'19004', N'', N'', NULL, 1021, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1021', N'미술계열(회화학과)', N'19004', N'', N'', NULL, 1021, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1022', N'미술계열(미술학과)', N'19004', N'', N'', NULL, 1022, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1023', N'미술계열(동양화과)', N'19004', N'', N'', NULL, 1023, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1024', N'미술계열(서양화과)', N'19004', N'', N'', NULL, 1024, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1025', N'미술계열(공예학과)', N'19004', N'', N'', NULL, 1025, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1026', N'미술계열(조소학과)', N'19004', N'', N'', NULL, 1026, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1027', N'미술계열(도예과)', N'19004', N'', N'', NULL, 1027, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1028', N'미술계열(응용미술학과)', N'19004', N'', N'', NULL, 1028, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1029', N'미술계열(실내디자인학과)', N'19004', N'', N'', NULL, 1029, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1030', N'미술계열(가구디자인과)', N'19004', N'', N'', NULL, 1031, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1031', N'미술계열(산업디자인학과)', N'19004', N'', N'', NULL, 1031, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1032', N'미술계열(멀티미디어디자인학과)', N'19004', N'', N'', NULL, 1032, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1033', N'미술계열(컴퓨터그래픽디자인학과)', N'19004', N'', N'', NULL, 1033, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1034', N'미술계열(공업디자인학과)', N'19004', N'', N'', NULL, 1034, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1035', N'미술계열(사진학과)', N'19004', N'', N'', NULL, 1035, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1036', N'미술계열(만화학과)', N'19004', N'', N'', NULL, 1036, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1037', N'미술계열(미술평론학과)', N'19004', N'', N'', NULL, 1037, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1038', N'미술계열(기타)', N'19004', N'', N'', NULL, 1038, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1039', N'연극영화계열(연극영화학과)', N'19004', N'', N'', NULL, 1039, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1040', N'연극영화계열(영상예술학과)', N'19004', N'', N'', NULL, 1041, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1041', N'연극영화계열(기타)', N'19004', N'', N'', NULL, 1041, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1042', N'무용체육계열(체육학과)', N'19004', N'', N'', NULL, 1042, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1043', N'무용체육계열(바둑학과)', N'19004', N'', N'', NULL, 1043, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1044', N'무용체육계열(무용학과)', N'19004', N'', N'', NULL, 1044, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1045', N'무용체육계열(경호학과)', N'19004', N'', N'', NULL, 1045, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1046', N'무용체육계열(기타)', N'19004', N'', N'', NULL, 1046, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1047', N'사범계열(교육학과)', N'19004', N'', N'', NULL, 1047, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1048', N'사범계열(사범대어문계학과)', N'19004', N'', N'', NULL, 1048, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1049', N'사범계열(사범대인문사회학과)', N'19004', N'', N'', NULL, 1049, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1050', N'사범계열(사범대이학계학과)', N'19004', N'', N'', NULL, 1051, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1051', N'사범계열(사범대공학계학과)', N'19004', N'', N'', NULL, 1051, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1052', N'사범계열(사범대예체능계학과)', N'19004', N'', N'', NULL, 1052, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1053', N'사범계열(유아교육학과)', N'19004', N'', N'', NULL, 1053, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1054', N'사범계열(초등교육학과)', N'19004', N'', N'', NULL, 1054, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1055', N'사범계열(특수교육학과)', N'19004', N'', N'', NULL, 1055, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1056', N'사범계열(기타)', N'19004', N'', N'', NULL, 1056, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1057', N'기타 학생(재수생,검정고시생 등)', N'19005', N'', N'', NULL, 1057, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1058', N'전업주부', N'20000', N'', N'', NULL, 1058, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1059', N'직업군인(육군)', N'21000', N'', N'', NULL, 1059, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1060', N'직업군인(해군)', N'21000', N'', N'', NULL, 1061, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1061', N'직업군인(공군)', N'21000', N'', N'', NULL, 1061, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1062', N'직업군인(해병대)', N'21000', N'', N'', NULL, 1062, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1063', N'직업군인(기타)', N'21000', N'', N'', NULL, 1063, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1064', N'육군', N'21000', N'', N'', NULL, 1064, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1065', N'해군', N'21000', N'', N'', NULL, 1065, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1066', N'공군', N'21000', N'', N'', NULL, 1066, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1067', N'해병대', N'21000', N'', N'', NULL, 1067, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1068', N'공익근무원', N'21000', N'', N'', NULL, 1068, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1069', N'방위산업체', N'21000', N'', N'', NULL, 1069, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1070', N'기타 군인', N'21000', N'', N'', NULL, 1071, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1071', N'회사원', N'22000', N'', N'', NULL, 1071, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1072', N'무직', N'23000', N'', N'', NULL, 1072, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1073', N'기타직종종사자', N'24000', N'', N'', NULL, 1073, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'01', N'미취학', N'SUN', N'House', N'', NULL, 1067, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'02', N'초등학교', N'SUN', N'House', N'', NULL, 1068, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'03', N'초퇴', N'', N'', N'', NULL, 1069, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'04', N'초졸', N'', N'', N'', NULL, 1071, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'05', N'중학교', N'SUN', N'House', N'', NULL, 1071, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'06', N'중퇴', N'', N'', N'', NULL, 1072, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'07', N'중졸', N'', N'', N'', NULL, 1073, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'08', N'고등학교', N'SUN', N'House', N'', NULL, 1074, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'09', N'고퇴', N'', N'', N'', NULL, 1075, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'10', N'고졸', N'', N'', N'', NULL, 1076, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'11', N'대학교', N'', N'House', N'', NULL, 1077, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'12', N'대퇴', N'', N'', N'', NULL, 1078, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'13', N'대졸', N'', N'', N'', NULL, 1079, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'14', N'전문대', N'', N'House', N'', NULL, 1081, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'15', N'전문대퇴', N'', N'', N'', NULL, 1081, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'16', N'전문대졸', N'', N'', N'', NULL, 1082, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'17', N'대학원', N'', N'House', N'', NULL, 1083, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'18', N'대학원퇴', N'', N'', N'', NULL, 1084, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'19', N'대학원졸', N'', N'', N'', NULL, 1085, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'20', N'박사과정', N'', N'', N'', NULL, 1086, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'21', N'박사', N'', N'', N'', NULL, 1087, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'22', N'기타', N'', N'House', N'', NULL, 1088, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'1', N'1', N'', N'', N'', NULL, 1088, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'10', N'10', N'', N'', N'', NULL, 1097, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'11', N'11', N'', N'', N'', NULL, 1098, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'12', N'12', N'', N'', N'', NULL, 1099, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'2', N'2', N'', N'', N'', NULL, 1089, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'3', N'3', N'', N'', N'', NULL, 1091, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'4', N'4', N'', N'', N'', NULL, 1091, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'5', N'5', N'', N'', N'', NULL, 1092, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'6', N'6', N'', N'', N'', NULL, 1093, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'7', N'7', N'', N'', N'', NULL, 1094, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'8', N'8', N'', N'', N'', NULL, 1095, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeDetail] ([ApplicationID], [CodeGroupID], [CodeID], [CodeValue], [Custom1], [Custom2], [Custom3], [SelectYN], [DisplayOrder], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'9', N'9', N'', N'', N'', NULL, 1096, 1, 0, CAST(N'2020-02-07T16:12:43.673' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM001', N'1', N'부서코드', N'부서의 코드그룹', N'Custom1', N'Custom2', N'Custom3', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM002', N'1', N'활동코드1', N'부서활동 코드그룹', N'부서별 활동관리를 위한 부서 코', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM003', N'1', N'년도테스트', N'년도테스트', N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM004', N'1', N'기수테스트3', N'기수테스트', N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM005', N'1', N'체크여부', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM006', N'1', N'교육참여도테스트', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM009', N'1', N'성별', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM010', N'1', N'혈액형', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM011', N'1', N'종교', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM012', N'1', N'국가명', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM013', N'1', N'결혼구분', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM015', N'1', N'직종', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM016', N'1', N'직업', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM017', N'1', N'학력구분', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
INSERT [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID], [CodeType], [CodeGroupName], [Description], [Custom1], [Custom2], [Custom3], [UseYN], [CreatePersonID], [CreateDateTime]) VALUES (1, N'CMM018', N'1', N'월', NULL, N'', N'', N'', 1, 1, CAST(N'2020-02-07T16:11:58.127' AS DateTime))
GO
ALTER TABLE [dbo].[CodeDetail]  WITH CHECK ADD  CONSTRAINT [FK_CodeDetail_CodeGroup] FOREIGN KEY([ApplicationID], [CodeGroupID])
REFERENCES [dbo].[CodeGroup] ([ApplicationID], [CodeGroupID])
GO
ALTER TABLE [dbo].[CodeDetail] CHECK CONSTRAINT [FK_CodeDetail_CodeGroup]
GO
ALTER TABLE [dbo].[CodeGroup]  WITH CHECK ADD  CONSTRAINT [FK_CodeGroup_Application] FOREIGN KEY([ApplicationID])
REFERENCES [dbo].[Application] ([ApplicationID])
GO
ALTER TABLE [dbo].[CodeGroup] CHECK CONSTRAINT [FK_CodeGroup_Application]
GO
USE [master]
GO
ALTER DATABASE [HandTest] SET  READ_WRITE 
GO
