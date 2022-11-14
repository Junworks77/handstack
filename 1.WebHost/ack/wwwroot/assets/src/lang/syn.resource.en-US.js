(function (context, $res) {
    if (!$res) {
        throw new Error('There are no $res resource objects.');
    }
    $res.add('localeID', 'en-US');

    $res.add('progress', 'In progress.');
    $res.add('append', 'New input status.');
    $res.add('appendPre', 'In the screen structure.');
    $res.add('retrieve', 'It was normally inquired.');
    $res.add('retrieveException', 'A problem generated data by the inquired process.');
    $res.add('retrievePre', 'During data inquiry.');
    $res.add('save', 'It was normally preserved.');
    $res.add('saveException', 'A problem generated data by the preserved process.');
    $res.add('savePre', 'It\'s being preserved.');
    $res.add('update', 'It was normally corrected.');
    $res.add('updateException', 'A problem generated data by the corrected process.');
    $res.add('updatePre', 'It\'s being corrected.');
    $res.add('remove', 'It was normally eliminated.');
    $res.add('removeException', 'A problem generated data by the eliminated process.');
    $res.add('removePre', 'It\'s eliminated.');
    $res.add('copyAppend', 'Existence data was copied and it was changed by input status.');
    $res.add('userInfoNothing', 'A problem occurred to user information.');

    $res.add('isLogOut', 'Do you log out really?');
    $res.add('waiting', 'Please wait only a moment...');
    $res.add('notElemnet', 'Control wasn\'t found. Please check a query and the HyperText Markup Language design.');
    $res.add('dualElemnet', 'The ID for "{0}" was found by control of the name I overlapped by the present page or the ID.');
    $res.add('requiredKeyData', 'Indispensable input item slip');
    $res.add('requiredInsertData', 'The lower item is an indispensable input item.');
    $res.add('errorMessage', 'An error occurred.');
    $res.add('serverErrorMessage', 'An error occurred by a server.');
    $res.add('initialComplete', 'Screen structure completion');
    $res.add('initialException', 'Screen structure failure');
    $res.add('isDateTimeInsert', '"{0}" it has to input a day of the format and time.');
    $res.add('isDateInsert', '"{0}" it has to input a day of the format.');
    $res.add('isTimeInsert', '"{0}" it has to input time of the format.');
    $res.add('isNumericInsert', 'It has to input a number.');
    $res.add('forceSave', 'Is the data which is being edited preserved?');
    $res.add('textMaxLength', 'The number of digits of "{0}" that can be entered has been exceeded. In English, other characters with one digit are calculated by two digits.');

    $res.add('create', 'input');
    $res.add('read', 'inquiry');
    $res.add('find', 'search');
    $res.add('edit', 'correction');
    $res.add('delele', 'elimination');
    $res.add('removeStatusNo', 'elimination isn\'t in the possible state. After inquiring data, I have to eliminate. ');
    $res.add('removeConfirm', 'Is it eliminated in truth?');
    $res.add('notData', 'there is no data. ');
    $res.add('notCondData', 'there is no data which matches the input condition. ');
    $res.add('notRetrieveCond', 'the item necessary to inquiry wasn\'t input. ');
    $res.add('notDateBetween', 'it isn\'t possible to happen to starting sunshades of the complete weather of "{0}" "{1}" recently. ');
    $res.add('notDate', 'a correct day is input, and I have to choose. ');
    $res.add('notFindCond', 'it has to input sentences necessary to a search. It has to input more than two letter for a correct search. ');
    $res.add('selectData', 'I have to choose data.');
    $res.add('selectAll', 'whole');
    $res.add('saveExcel', 'Excel It\'s during download.');
    $res.add('saveExcelComplete', 'Excel  A file was downloaded.');
    $res.add('saveExcelFail', 'Excel  File  I failed in download.');
    $res.add('notSupportContent', 'the contents-type which aren\'t supported.');
})(globalRoot, syn.$res);
