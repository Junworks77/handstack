(function (context, $res) {
    if (!$res) {
        throw new Error("$res 리소스 객체가 없습니다.");
    }
    $res.add('localeID', 'ko-KR');

    $res.add('progress', '진행 중입니다.');
    $res.add('appendTo', '신규 입력 상태입니다.');
    $res.add('appendPre', '화면 구성 중...');
    $res.add('retrieve', '정상적으로 조회되었습니다.');
    $res.add('retrieveException', '데이터를 조회하는 과정에서 문제가 발생하였습니다.');
    $res.add('retrievePre', '데이터 조회 중...');
    $res.add('save', '정상적으로 저장되었습니다.');
    $res.add('saveException', '데이터를 저장하는 과정에서 문제가 발생하였습니다.');
    $res.add('savePre', '저장 중...');
    $res.add('update', '정상적으로 수정되었습니다.');
    $res.add('updateException', '데이터를 수정하는 과정에서 문제가 발생하였습니다.');
    $res.add('updatePre', '수정 중...');
    $res.add('remove', '정상적으로 삭제되었습니다.');
    $res.add('removeException', '데이터를 삭제하는 과정에서 문제가 발생하였습니다.');
    $res.add('removePre', '삭제 중...');
    $res.add('copyAppend', '기존 데이터를 복사하여 입력 상태로 전환했습니다.');
    $res.add('userInfoNothing', '사용자 정보에 문제가 발생했습니다.');

    $res.add('isLogOut', '정말로 로그아웃 하시겠습니까?');
    $res.add('waiting', '잠시만 기다려주세요...');
    $res.add('notElemnet', '컨트롤이 발견되지 않았습니다. 쿼리나 HTML 디자인을 살펴보세요');
    $res.add('dualElemnet', '"{0}"의 아이디는 현재 페이지에서 중복된 이름 또는 아이디의 컨트롤로 발견되었습니다.');
    $res.add('requiredKeyData', '필수 입력 항목 오류');
    $res.add('requiredInsertData', '아래 항목은 필수 입력 항목입니다.');
    $res.add('errorMessage', '에러가 발생했습니다.');
    $res.add('serverErrorMessage', '서버에서 에러가 발생했습니다.');
    $res.add('initialComplete', '화면 구성 완료');
    $res.add('initialException', '화면 구성 실패');
    $res.add('isDateTimeInsert', '"{0}" 포맷의 날짜와 시간을 입력해야 합니다.');
    $res.add('isDateInsert', '"{0}" 포맷의 날짜를 입력해야 합니다.');
    $res.add('isTimeInsert', '"{0}" 포맷의 시간을 입력해야 합니다.');
    $res.add('isNumericInsert', '숫자를 입력해야 합니다.');
    $res.add('forceSave', '편집중인 데이터를 저장하시겠습니까?');
    $res.add('textMaxLength', '입력 가능한 "{0}"자리수를 넘었습니다');

    $res.add('create', '입력');
    $res.add('read', '조회');
    $res.add('find', '검색');
    $res.add('edit', '수정');
    $res.add('delele', '삭제');
    $res.add('removeStatusNo', '삭제 가능한 상태가 아닙니다. 데이터를 조회한 후 삭제 해야 합니다.');
    $res.add('removeConfirm', '정말로 삭제 하시겠습니까?');
    $res.add('notData', '데이터가 없습니다.');
    $res.add('notCondData', '입력하신 조건에 맞는 데이터가 없습니다.');
    $res.add('notRetrieveCond', '조회에 필요한 항목이 입력되지 않았습니다.');
    $res.add('notDateBetween', '기간이 올바르게 설정되지 않았습니다.');
    $res.add('notDate', '정확한 날짜를 입력 하거나 선택해야 합니다.');
    $res.add('notFindCond', '검색에 필요한 문장을 입력해야 합니다. 정확한 검색을 위해 두글자 이상 입력해야 합니다.');
    $res.add('selectData', '데이터를 선택해야 합니다.');
    $res.add('selectAll', '전체');
    $res.add('saveExcel', '엑셀 다운로드 중입니다.');
    $res.add('saveExcelComplete', '엑셀 파일을 다운로드 했습니다.');
    $res.add('saveExcelFail', '엑셀 파일 다운로드를 실패 했습니다');
    $res.add('notSupportContent', '지원 하지 않는 컨텐츠 타입입니다.');
})(globalRoot, syn.$res);
