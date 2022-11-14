## ProgramID
* 거래 대상 어플리케이션ID 3자리

## BusinessID
* 거래 대상 프로젝트ID 3자리

## SystemID
* 거래 대상 시스템ID

## TransactionID
* 거래 대상 ID, <메뉴분류2자리> + <메뉴2자리> + <하위메뉴1자리>로 부여
* [#1316](http://redmine.handstack.kr/redmine/issues/1316) 일감 참조

## ModifiedDate
* 거래 설정 최종수정일자

## DataSource
* 화면에 종속되는 기초코드, 코드도움 데이터 소스
* 하드코딩 가능한 코드일 경우 권장
* 데이터 소스 자동 생성 기능을 통해 관리 권장
    * 입력 항목중 필수 항목은 CodeColumnID, ValueColumnID이며 DataSource내 데이터와 반드시 일치 해야함
    * Scheme 항목은 코드도움 팝업시 사용
    * Description, CreateDateTime 항목은 정보성으로 선택 항목

```js
 <!-- json -->
"CMM024": {
    "Description": "기초코드 데이터",
    "CodeColumnID": "CodeID",
    "ValueColumnID": "CodeValue",
    "CreateDateTime": "2012-03-22 오후 2:00:00",
    "Scheme": [
    {
        "ColumnID": "SelectYN",
        "ColumnText": "기본선택여부",
        "HiddenYN": true
    },
    {
        "ColumnID": "LocaleID",
        "ColumnText": "언어권ID",
        "HiddenYN": true
    },
    {
        "ColumnID": "CodeID",
        "ColumnText": "코드ID",
        "HiddenYN": false
    },
    {
        "ColumnID": "CodeValue",
        "ColumnText": "코드값",
        "HiddenYN": false
    }
    ],
    "DataSource": [
    {
        "CodeID": "AHS",
        "CodeValue": "용역 Hired Services",
        "SelectYN": null,
        "LocaleID": "ko-KR"
    },
    {
        "CodeID": "AST",
        "CodeValue": "직원 Staff",
        "SelectYN": null,
        "LocaleID": "ko-KR"
    },
    {
        "CodeID": "ASS",
        "CodeValue": "주임 Senior Staff",
        "SelectYN": null,
        "LocaleID": "ko-KR"
    }
    ]
}
```

## Transactions
화면 거래 정보 설정으로 아래 예시와 같이 구성하며, 주요 항목에 대한 설명은 다음과 같음

* 화면내 여러개의 서버와의 거래가 있기 때문에 기능단위(FunctionID)로 구성
* 거래는 요청(Inputs)/응답(Outputs)으로 구성
* FunctionID는 거래 대상 Function ID이며 서버 개발자와 확인 필요
* FunctionID는 <명령구분1자리> + <순번2자리>로 구성되며, C, R, U, D, M 접두어에 순번 2자리를 사용. [#1316](http://redmine.handstack.kr/redmine/issues/1316) 일감 참조
* 거래시 Inputs, Outputs의 단위는 여러개로 구성 가능
* Inputs > RequestType은 Row, List 중 하나이며, 거래시 Row는 1건을 List는 여러건을 전송
* Inputs > RequestType이 List일 경우 DataFieldID를 입력해야 하며, 일반적으로 그리드 컨트롤의 syn-datafield 값을 입력
* Inputs > Items의 키는 거래 대상 식별ID이며 FieldID는 컨트롤의 syn-datafield 값, DataType은 컨트롤의 데이터 타입을 표현
* Outputs > ResponseType은 Form, Grid, (Chart... 예정) 중 하나
* 거래응답시 Form은 1건을 나타내며, 각각의 컨트롤에 데이터를 설정
* 화면에 여러 FORM Element가 사용되어 있을 경우 DataFieldID에 FORM 태그의 syn-datafield 값을 지정
* 거래응답시 Grid는 여러건을 나타내며, 그리드, 차트등 여러 데이터를 구성하는 컨트롤의 syn-datafield 값을 지정
* Items > DataType은 string, int, bool, (date 예정)으로 설정

```js
 <!-- json -->
"Transactions": [
	{
		"FunctionID": "R01", // 거래 Function ID
		"Inputs": [
			{
				"RequestType": "Row",
				"DataFieldID": "",
				"Items": {
					"SelecteAppID": {
						"FieldID": "ApplicationID",
						"DataType": "int "
					},
					"ProjectID": {
						"FieldID": "ProjectID",
						"DataType": "string"
					},
					"ProjectName": {
						"FieldID": "ProjectName",
						"DataType": "string"
					},
					"SelecteProjectType": {
						"FieldID": "ProjectType",
						"DataType": "string"
					}
				}
			}
		],
		"Outputs": [
			{
				"ResponseType": "Grid",
				"DataFieldID": "CodeDetail",
				"Items": {
					"ApplicationID": {
						"FieldID": "ApplicationID",
						"DataType": "int"
					},
					"ProjectID": {
						"FieldID": "ProjectID",
						"DataType": "string"
					},
					"ProjectName": {
						"FieldID": "ProjectName",
						"DataType": "string"
					},
					"ProjectType": {
						"FieldID": "ProjectType",
						"DataType": "string"
					},
					"ProjectTypeName": {
						"FieldID": "ProjectTypeName",
						"DataType": "string"
					},
					"UseYN": {
						"FieldID": "UseYN",
						"DataType": "bool"
					},
					"Remark": {
						"FieldID": "Remark",
						"DataType": "string"
					},
					"CreateUserID": {
						"FieldID": "CreateUserID",
						"DataType": "int"
					},
					"CreateUserName": {
						"FieldID": "CreateUserName",
						"DataType": "string"
					},
					"CreateDateTime": {
						"FieldID": "CreateDateTime",
						"DataType": "string"
					}
				}
			}
		]
	},
	{
		"FunctionID": "M01",
		"Inputs": [
			{
				"RequestType": "List",
				"DataFieldID": "CodeDetail",
				"Items": {
					"Flag": {
						"FieldID": "Flag",
						"DataType": "string"
					},
					"ApplicationID": {
						"FieldID": "ApplicationID",
						"DataType": "int"
					},
					"ProjectID": {
						"FieldID": "ProjectID",
						"DataType": "string"
					},
					"ProjectName": {
						"FieldID": "ProjectName",
						"DataType": "string"
					},
					"ProjectType": {
						"FieldID": "ProjectType",
						"DataType": "string"
					},
					"UseYN": {
						"FieldID": "UseYN",
						"DataType": "bool"
					},
					"Remark": {
						"FieldID": "Remark",
						"DataType": "string"
					},
					"CreateUserID": {
						"FieldID": "CreateUserID",
						"DataType": "int"
					}
				}
			}
		],
		"Outputs": [
			{
				"ResponseType": "Grid",
				"DataFieldID": "CodeDetail",
				"Items": {
					"ApplicationID": {
						"FieldID": "ApplicationID",
						"DataType": "int"
					},
					"ProjectID": {
						"FieldID": "ProjectID",
						"DataType": "string"
					},
					"ProjectName": {
						"FieldID": "ProjectName",
						"DataType": "string"
					},
					"ProjectType": {
						"FieldID": "ProjectType",
						"DataType": "string"
					},
					"UseYN": {
						"FieldID": "UseYN",
						"DataType": "bool"
					},
					"Remark": {
						"FieldID": "Remark",
						"DataType": "string"
					},
					"CreateUserID": {
						"FieldID": "CreateUserID",
						"DataType": "int"
					}
				}
			}
		]
	}
]
```