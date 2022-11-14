syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    focusNode: null,
    orgchart: null,
    dataSource: null,
    pageLoad: function () {
        var datasource = {
            'name': 'Lao Lao',
            'title': 'general manager',
            'office': 'office',
            'children': [
                { 'name': 'Bo Miao', 'title': 'department manager', 'office': '본사' },
                {
                    'name': 'Su Miao',
                    'title': 'department manager',
                    'office': '본사',
                    'children': [
                        {
                            'name': 'Tie Hua',
                            'title': 'senior engineer',
                            'office': '본사'
                        },
                        {
                            'name': 'Hei Hei',
                            'title': 'senior engineer',
                            'office': '본사',
                            'children': [
                                {
                                    'name': 'Dan Dan',
                                    'title': 'engineer',
                                    'office': '본사'
                                }
                            ]
                        },
                        {
                            'name': 'Pang Pang',
                            'title': 'senior engineer',
                            'office': '본사'
                        }
                    ]
                },
                {
                    'name': 'Hong Miao',
                    'title': 'department manager',
                    'office': '본사'
                }
            ]
        };

        $this.orgchart = $('#chart-container').orgchart({
            data: datasource,
            nodeContent: 'title',
            direction: 't2b', // l2r
            pan: true,
            zoom: true,
            draggable: true,
            className: 'top-level',
            nodeTitle: 'name',
            nodeContent: 'title',
            verticalLevel: 4,
            nodeTemplate: function (data) {
                return '<span class="office">' + data.office + '</span><div class="title">' + data.name + '</div><div class="content">' + data.title + '</div>';
            },
            createNode: function ($node, data) {
                // $node[0].id = ['organID + elID'];
                // $node.html('custom html template');
                // $node.children('.title').html('custom html template');

                $node.on('click', function (event) {
                    if (!$(event.target).is('.edge, .toggleBtn')) {
                        var that = $(this);
                        var $chart = that.closest('.orgchart');
                        console.log(data);
                    }
                });

                var secondMenuIcon = $('<i>', {
                    'class': 'oci oci-info-circle second-menu-icon',
                    click: function () {
                        $(this).siblings('.second-menu').toggle();
                    }
                });
                var secondMenu = '<div class="second-menu"><img class="avatar" src="https://dabeng.github.io/OrgChart/img/avatar/' + data.id + '.jpg"></div>';
                $node.append(secondMenuIcon).append(secondMenu);
            }
        });

        $this.orgchart.$chart.on('nodedrop.orgchart', function (event, extraParams) {
            console.log('draggedNode:' + extraParams.draggedNode.children('.title').text()
                + ', dragZone:' + extraParams.dragZone.children('.title').text()
                + ', dropZone:' + extraParams.dropZone.children('.title').text()
            );
        });

        $this.orgchart.$chartContainer.on('click', '.node', function () {
            var that = $(this);
            var nodeText = that.find('.title').text();
            console.log('focus node {0}'.format(nodeText));
            $this.focusNode = that;
        });

        $this.orgchart.$chartContainer.on('click', '.orgchart', function (event) {
            if ($(event.target).closest('.node').length == 0) {
                console.log('focusout node');
            }
        });
    },

    btnFlat2Recursive_click: function () {
        $this.dataSource = JSON.parse(syn.$l.get('txtSourceData').value);

        var jsonRoot = syn.$l.flat2Nested($this.dataSource, 'id', 'parentId', 'children');
        syn.$l.eventLog('btnFlat2Recursive_click', JSON.stringify(jsonRoot));
        $this.orgchart.init({ data: jsonRoot });

        $this.orgchart.$chart.on('nodedrop.orgchart', function (event, extraParams) {
            console.log('draggedNode:' + extraParams.draggedNode.children('.title').text()
                + ', dragZone:' + extraParams.dragZone.children('.title').text()
                + ', dropZone:' + extraParams.dropZone.children('.title').text()
            );
        });
    },

    btnRecursive2Flat_click: function () {
        $this.dataSource = JSON.parse(syn.$l.get('txtSourceData').value);

        var flatItems = syn.$l.nested2Flat($this.dataSource, 'id', 'parentId', 'children');
        syn.$l.eventLog('btnRecursive2Flat_click', JSON.stringify(flatItems));
    },

    btnFindRecursiveData_click: function () {
        $this.dataSource = JSON.parse(syn.$l.get('txtSourceData').value);

        var jsonRoot = syn.$l.flat2Nested($this.dataSource, 'id', 'parentId');
        var findItem = syn.$l.findNestedByID(jsonRoot, 10, 'id', 'items');
        syn.$l.eventLog('btnFindRecursiveData_click', JSON.stringify(findItem));
    },

    btnGetHierarchy_click: function () {
        $this.dataSource = JSON.parse(syn.$l.get('txtSourceData').value);

        var jsonRoot = syn.$l.flat2Nested($this.dataSource, 'id', 'parentId');

        var hierarchy = $this.orgchart.getHierarchy();
        syn.$l.eventLog('btnGetHierarchy_click', JSON.stringify(hierarchy));

        var nodeItems = [];
        var flatItems = syn.$l.nested2Flat(hierarchy, 'id', 'parentId', 'children');
        for (var i = 0; i < flatItems.length; i++) {
            var item = flatItems[i];

            var findItem = syn.$l.findNestedByID(jsonRoot, item.id, 'id', 'items');
            if (findItem != null) {
                var node = $ref.clone(findItem, false);
                delete node['items'];
                node['parentId'] = item['parentId'];
                nodeItems.push(node);
            }
        }

        syn.$l.eventLog('btnGetHierarchy_click', JSON.stringify(nodeItems));
    },

    btnAddParent_click: function () {
        if ($this.focusNode != null) {
            $this.orgchart.addParent($this.focusNode, {
                "id": 13,
                "parentId": 12,
                "typeId": 1,
                "name": "BOND-1001",
                "title": 3985.331955,
                "node2": 2,
                "field3": 20567.245997,
                "node3": 3,
                "field4": 1
            });
        }
    },

    btnAddSiblings_click: function () {
        if ($this.focusNode != null) {
            $this.orgchart.addSiblings($this.focusNode, [{
                "id": 13,
                "parentId": 12,
                "typeId": 1,
                "name": "BOND-1001",
                "title": 3985.331955,
                "node2": 2,
                "field3": 20567.245997,
                "node3": 3,
                "field4": 1
            }]);
        }
    },

    btnAddChildren_click: function () {
        if ($this.focusNode != null) {
            $this.orgchart.addChildren($this.focusNode, [{
                "id": 13,
                "parentId": 12,
                "typeId": 1,
                "name": "BOND-1001",
                "title": 3985.331955,
                "node2": 2,
                "field3": 20567.245997,
                "node3": 3,
                "field4": 1
            }]);
        }
    },

    btnRemoveNode_click: function () {
        if ($this.focusNode != null) {
            $this.orgchart.removeNodes($this.focusNode);
        }
    },

    btnExportPNG_click: function () {
        $this.orgchart.export(syn.$l.random());
    },

    ctxTreeItem_select: function (evt, ui) {
        syn.$l.eventLog('ctxTreeItem_select', '');
    }
});
