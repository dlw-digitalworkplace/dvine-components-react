# Change Log - @dlw-digitalworkplace/react-fabric-taxonomypicker

This log was last generated on Wed, 02 Dec 2020 18:23:42 GMT and should not be manually modified.

## 1.12.1
Wed, 02 Dec 2020 18:23:42 GMT

### Patches

- Fix wrapping of long labels in treeview

## 1.12.0
Tue, 19 May 2020 13:00:02 GMT

### Minor changes

- Added path delimiter setting to change default semicolon

## 1.11.3
Tue, 12 May 2020 05:08:26 GMT

### Patches

- Updated Office UI Fabric React dependency to latest v5

## 1.11.2
Mon, 04 May 2020 11:41:36 GMT

### Patches

- Fixed an issue where term label was not shown after creation

## 1.11.1
Wed, 15 Apr 2020 13:10:24 GMT

### Patches

- Reverted peerdependency change

## 1.11.0
Wed, 15 Apr 2020 12:44:58 GMT

### Minor changes

- Added an option to hide deprecated terms in the term tree

## 1.10.4
Fri, 12 Jul 2019 13:58:42 GMT

### Patches

- 1. Bugfix for adding terms in the picker dialog when not allowed 2. Bugfix for selecting root term in the picker dialog treeview

## 1.10.3
Thu, 04 Jul 2019 09:34:55 GMT

### Patches

- Fix for adding empty terms to the term set

## 1.10.2
Wed, 03 Jul 2019 13:58:58 GMT

### Patches

- Bugfix for leading and trailing spaces in resolve terms

## 1.10.1
Wed, 20 Feb 2019 07:38:16 GMT

### Patches

- Bugfix for item adding when suggestions are still loading

## 1.10.0
Mon, 28 Jan 2019 17:41:10 GMT

### Minor changes

- x) Allow custom title in taxonomy dialog term picker

## 1.9.0
Tue, 08 Jan 2019 14:48:10 GMT

### Minor changes

- x) Added showTranslatedLabels property to show or hide the translated labels in the term pickers for performance reasons. Setting to false will get rid of the long getDefaultLabel queries per term. x) Updated demo: lcid was not properly passed along. x) Bug when searching for strange characters in taxonomy dialog term picker

## 1.8.1
Thu, 20 Dec 2018 14:31:06 GMT

### Patches

- Search for terms with unicode characters such as &

## 1.8.0
Mon, 17 Dec 2018 14:43:24 GMT

### Minor changes

- First selected node in picker is also selected in dialog

## 1.7.1
Fri, 14 Dec 2018 09:13:38 GMT

### Patches

- Bug in selecting translated term: label was not translated in the selection input

## 1.7.0
Thu, 13 Dec 2018 15:34:29 GMT

### Minor changes

- Fetch translated label by locale based on lcid property

## 1.6.0
Mon, 10 Dec 2018 15:15:43 GMT

### Minor changes

- Added sorting, added return key event on new terms

## 1.5.0
Tue, 06 Nov 2018 08:58:30 GMT

### Minor changes

- Insert terms in the taxonomy dialog for an open term set

## 1.4.1
Mon, 20 Aug 2018 11:38:32 GMT

### Patches

- NPM package fix

## 1.4.0
Mon, 20 Aug 2018 11:14:43 GMT

### Minor changes

- Added configurable root term

## 1.3.0
Tue, 17 Jul 2018 11:43:59 GMT

### Minor changes

- Added searching in term labels

## 1.2.1
Thu, 12 Jul 2018 12:27:47 GMT

### Patches

- Treeview css fix, reference casing fix

## 1.2.0
Fri, 15 Jun 2018 11:24:11 GMT

### Minor changes

- Added insertion into open term sets

## 1.1.0
Wed, 13 Jun 2018 13:53:24 GMT

### Minor changes

- Added property to pass current site url

## 1.0.5
Wed, 02 May 2018 08:52:55 GMT

### Patches

- Fixed issue with itemLimit in picker dialog

## 1.0.4
Fri, 27 Apr 2018 09:24:11 GMT

### Patches

- Fixed duplicate term selection

## 1.0.3
Wed, 25 Apr 2018 14:34:00 GMT

### Patches

- Removed confusing prop

## 1.0.2
Tue, 17 Apr 2018 06:40:15 GMT

### Patches

- Fixed itemLimit passthrough

## 1.0.1
Sun, 15 Apr 2018 15:00:10 GMT

### Patches

- Updated webpack build

