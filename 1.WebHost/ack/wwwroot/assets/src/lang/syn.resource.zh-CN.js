(function (context, $res) {
    if (!$res) {
        throw new Error('没有$res资源客体。');
    }
    $res.add('localeID', 'zh-CN');

    $res.add('progress', '是进行中。');
    $res.add('append', '是新输入状态。');
    $res.add('appendPre', '画面构成中，...');
    $res.add('retrieve', '正常地被询问了。');
    $res.add('retrieveException', '在询问数据的过程中问题发生了。');
    $res.add('retrievePre', '数据查询中，...');
    $res.add('save', '正常地被保存了。');
    $res.add('saveException', '在保存数据的过程中问题发生了。');
    $res.add('savePre', '保存中，...');
    $res.add('update', '正常地被修正了。');
    $res.add('updateException', '在修正数据的过程中问题发生了。');
    $res.add('updatePre', '修正中，...');
    $res.add('remove', '正常地被删除了。');
    $res.add('removeException', '在删除数据的过程中问题发生了。');
    $res.add('removePre', '删除中，...');
    $res.add('copyAppend', '复制原有数据以输入状态转换了。');
    $res.add('userInfoNothing', '问题发生了为使用者信息。');

    $res.add('isLogOut', '真的对数(记录) 出界是不是做？');
    $res.add('waiting', '请等只稍微的间。。。');
    $res.add('notElemnet', '控制不被发现。 请调查查询和HTML设计。');
    $res.add('dualElemnet', '"{0}"的ID以现在的页重复的名字或，由于ID的控制被发现了。');
    $res.add('requiredKeyData', '必需输入项目错误');
    $res.add('requiredInsertData', '下项目是必需输入项目。');
    $res.add('errorMessage', '错误发生了。');
    $res.add('serverErrorMessage', '用服务器错误发生了。');
    $res.add('initialComplete', '画面构成完成');
    $res.add('initialException', '画面构成失败');
    $res.add('isDateTimeInsert', '与"{0}"格式的日必须输入时间。');
    $res.add('isDateInsert', '必须输入"{0}"格式的日。');
    $res.add('isTimeInsert', '必须输入"{0}"格式的时间。');
    $res.add('isNumericInsert', '必须输入数字。');
    $res.add('forceSave', '是不是保存编辑中的数据？');
    $res.add('textMaxLength', '已超过可以输入的 "{0}"的位数。在英语中，具有一位数字的其他字符由两位数字计算。');

    $res.add('create', '输入');
    $res.add('read', '查询');
    $res.add('find', '检索');
    $res.add('edit', '修正');
    $res.add('delele', '删除');
    $res.add('removeStatusNo', '不是删除可以的状态。 必须询问数据之后删除。');
    $res.add('removeConfirm', '真的是不是删除？');
    $res.add('notData', '没有数据。');
    $res.add('notCondData', '没有适合被输入的条件的数据。');
    $res.add('notRetrieveCond', '为查询需要的项目不被输入。');
    $res.add('notDateBetween', '"{0}"的完成日"{1}"的 开始星期日更加最近不能发生。');
    $res.add('notDate', '必须输入正确的日或者选择。');
    $res.add('notFindCond', '必须输入需要的文章为检索。 为了正确的检索必须二字以上输入。');
    $res.add('selectData', '必须选择数据。');
    $res.add('selectAll', '全部');
    $res.add('saveExcel', 'Excel 下载中。');
    $res.add('saveExcelComplete', '下载Excel 文件。');
    $res.add('saveExcelFail', 'Excel 文件下载失败了');
    $res.add('notSupportContent', '不支援的内容类型。');
})(globalRoot, syn.$res);
