define("AdvancedSort/AdvancedSortEntities", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AdvancedSortEntities;
    (function (AdvancedSortEntities) {
        class SortColumn {
            constructor(data) {
                this.columnName = data.columnName;
                this.columnValue = data.columnValue;
                this.sortOrder = data.sortOrder;
                this.sortPosition = data.sortPosition;
            }
        }
        AdvancedSortEntities.SortColumn = SortColumn;
        class ComponentVariable {
            constructor(gridName, excludedColumn) {
                this.gridName = gridName;
                this.excludedColumn = excludedColumn;
                this.sortPopupWindow = $("#advanced-sort");
                this.sortPopupWindowContent = $("#advanced-sort .sort-content");
                this.gridPanelSelector = "#" + this.gridName;
                this.openPopupButtonSelector = '#' + gridName + '-openpopup';
                this.clearSortButtonSelector = '#' + gridName + '-clearsort';
                this.sortPopupUrlElementSelector = $("#GetAdvancedSortPopupId");
                this.availableColumnListBoxSelector = "#advanced-sort-available";
                this.selectedColumnListBoxSelector = "#advanced-sort-selected";
                this.applyAdvancedSortSelector = "#applyAdvancedSort";
                this.resetAdvancedSortSelector = "#resetAdvancedSort";
                this.clearAdvancedSortSelector = "#clearAdvancedSort";
                this.colFieldMap = new Array();
                this.isAdvancedSortApplied = false;
            }
            get grid() {
                return $(this.gridPanelSelector).data('kendoGrid');
            }
            get openPopupButton() {
                return $(this.openPopupButtonSelector);
            }
            get clearSortButton() {
                return $(this.clearSortButtonSelector);
            }
            get sortPopupUrlElement() {
                return $(this.sortPopupUrlElementSelector);
            }
            get sortPopupUrl() {
                return $(this.sortPopupUrlElementSelector).prop('href');
            }
        }
        AdvancedSortEntities.ComponentVariable = ComponentVariable;
    })(AdvancedSortEntities = exports.AdvancedSortEntities || (exports.AdvancedSortEntities = {}));
});
define("Shared/LocalStorageHelper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LocalStorageHelper;
    (function (LocalStorageHelper) {
        class StorageItem {
            constructor(data) {
                this.key = data.key;
                this.value = data.value;
            }
        }
        LocalStorageHelper.StorageItem = StorageItem;
        class LocalStorageWorker {
            constructor() {
                this.localStorageSupported = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;
            }
            // add item to storage
            add(key, item) {
                if (this.localStorageSupported) {
                    localStorage.setItem(key, item);
                }
            }
            // get item by key from storage
            get(key) {
                if (this.localStorageSupported) {
                    var item = localStorage.getItem(key);
                    return item;
                }
                else {
                    return null;
                }
            }
            // get all items from storage
            getAllItems() {
                var list = new Array();
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    var value = localStorage.getItem(key);
                    list.push(new StorageItem({
                        key: key,
                        value: value
                    }));
                }
                return list;
            }
            // remove item from storage
            remove(key) {
                if (this.localStorageSupported) {
                    localStorage.removeItem(key);
                }
            }
        }
        LocalStorageHelper.LocalStorageWorker = LocalStorageWorker;
    })(LocalStorageHelper = exports.LocalStorageHelper || (exports.LocalStorageHelper = {}));
});
define("AdvancedSort/AdvancedSortLocalStorage", ["require", "exports", "Shared/LocalStorageHelper"], function (require, exports, LocalStorageHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AdvancedSortLocalStorage {
        constructor(storageKey) {
            this.storageWorker = new LocalStorageHelper_1.LocalStorageHelper.LocalStorageWorker();
            this.storageKey = storageKey;
            this.load();
        }
        sync(columnList) {
            if (columnList != null) {
                const mapOld = this.mapFromArray(this.sortColumns, 'columnValue');
                const mapNew = this.mapFromArray(columnList, 'columnValue');
                for (const id in mapOld) {
                    const index = this.sortColumns.indexOf(mapOld[id], 0);
                    if (!mapNew.hasOwnProperty(id)) {
                        // deleted
                        if (index > -1) {
                            this.sortColumns.splice(index, 1);
                        }
                    }
                    else if (!this.isEqual(mapNew[id], mapOld[id])) {
                        // updated
                        this.sortColumns[index] = mapNew[id];
                    }
                }
                for (const id in mapNew) {
                    if (!mapOld.hasOwnProperty(id)) {
                        // added
                        this.sortColumns.push(mapNew[id]);
                    }
                }
                this.save();
            }
        }
        clear() {
            this.storageWorker.remove(this.storageKey);
            this.sortColumns = new Array();
        }
        load() {
            this.sortColumns = new Array();
            var storageData = this.storageWorker.get(this.storageKey);
            if (storageData != null && storageData.length > 0) {
                var columns = JSON.parse(storageData);
                if (columns != null) {
                    this.sortColumns = columns;
                }
            }
        }
        save() {
            var jsonSortColumns = JSON.stringify(this.sortColumns);
            this.storageWorker.add(this.storageKey, jsonSortColumns);
        }
        mapFromArray(array, prop) {
            const map = {};
            for (let i = 0; i < array.length; i++) {
                map[array[i][prop]] = array[i];
            }
            return map;
        }
        isEqual(a, b) {
            return a.columnValue === b.columnValue
                && a.columnName === b.columnName
                && a.sortOrder === b.sortOrder
                && a.sortPosition === b.sortPosition;
        }
    }
    exports.AdvancedSortLocalStorage = AdvancedSortLocalStorage;
});
define("AdvancedSort/AdvancedSortService", ["require", "exports", "AdvancedSort/AdvancedSortLocalStorage"], function (require, exports, AdvancedSortLocalStorage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AdvancedSortService {
        constructor(componentVariable) {
            this.componentVariable = null;
            this.localStorage = null;
            this.componentVariable = componentVariable;
            this.localStorage = new AdvancedSortLocalStorage_1.AdvancedSortLocalStorage(this.componentVariable.gridName);
        }
        get sortColumns() {
            return this.localStorage.sortColumns
                .filter(x => {
                return this.componentVariable.colFieldMap.some(y => y.columnValue === x.columnValue);
            })
                .sort((n1, n2) => {
                if (n1.sortPosition > n2.sortPosition) {
                    return 1;
                }
                if (n1.sortPosition < n2.sortPosition) {
                    return -1;
                }
                return 0;
            });
        }
        get availableColumns() {
            return this.componentVariable.colFieldMap.filter(x => !this.localStorage.sortColumns.some(y => y.columnValue === x.columnValue));
        }
        syncToStorage(columnList) {
            this.localStorage.sync(columnList);
        }
        removeFromStorage() {
            this.localStorage.clear();
        }
    }
    exports.AdvancedSortService = AdvancedSortService;
});
define("AdvancedSort/AdvancedSortController", ["require", "exports", "AdvancedSort/AdvancedSortService", "AdvancedSort/AdvancedSortEntities"], function (require, exports, AdvancedSortService_1, AdvancedSortEntities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AdvancedSortController {
        constructor(componentVariable) {
            this.componentVariable = null;
            this.service = null;
            this.openPopup = () => {
                //clear all the popup content
                this.componentVariable.sortPopupWindowContent.empty();
                $.get(this.componentVariable.sortPopupUrl, {})
                    .done((response) => {
                    this.componentVariable.sortPopupWindowContent.html(response);
                    this.componentVariable.sortPopupWindow.kendoWindow({
                        title: "Advanced Sort",
                        visible: false,
                        minWidth: "550px",
                        width: "880px",
                        minHeight: "430px",
                        maxHeight: "900px",
                        draggable: true,
                        resizable: true,
                        modal: true,
                        actions: ["Close"],
                        animation: {
                            close: {
                                duration: 1000
                            },
                            open: {
                                duration: 1000
                            }
                        }
                    }).data("kendoWindow").center().open();
                    this.refreshDataSource();
                    this.wireEvents();
                    // indicate user with message whether advanced sort is applied or not to the grid
                    $("#sort-message #message").text(this.componentVariable.isAdvancedSortApplied ? 'Advanced Sort Applied' : 'Advanced Sort Not Applied');
                }).fail(() => {
                    notifier.error(this.componentVariable.sortPopupUrlElement.attr('data-error'), this.componentVariable.sortPopupUrlElement.attr('data-error-title'));
                });
            };
            this.applySort = () => {
                if (this.selectedColumnlistBox) {
                    var items = this.selectedColumnlistBox.items();
                    let stSort = new Array();
                    let dsSort = new Array();
                    if (items.length > 0) {
                        for (var i = 0; i < items.length; i++) {
                            var dataItem = this.selectedColumnlistBox.dataItem(items[i]);
                            var sortPosition = i + 1;
                            var sortOrder = this.getSortOrder(dataItem);
                            // data array for storage
                            stSort.push(new AdvancedSortEntities_1.AdvancedSortEntities.SortColumn({
                                columnName: dataItem.columnName,
                                columnValue: dataItem.columnValue,
                                sortOrder: sortOrder,
                                sortPosition: sortPosition
                            }));
                            // data array for grid
                            dsSort.push({
                                field: dataItem.columnValue,
                                dir: sortOrder > 0 ? "desc" : "asc"
                            });
                        }
                        this.service.syncToStorage(stSort);
                        this.componentVariable.isAdvancedSortApplied = true;
                    }
                    else {
                        this.service.removeFromStorage();
                        this.componentVariable.isAdvancedSortApplied = false;
                    }
                    this.sortPopupWindow.close();
                    this.componentVariable.grid.dataSource.sort(dsSort);
                }
            };
            this.clearSort = () => {
                this.componentVariable.grid.dataSource.sort(new Array());
                this.componentVariable.isAdvancedSortApplied = false;
            };
            this.wireEvents = () => {
                // popup window
                this.sortPopupWindow.setOptions({
                    close: () => {
                        if (this.sortPopupWindow) {
                            this.sortPopupWindow.destroy();
                        }
                    }
                });
                // available sort column listbox
                this.availableColumnlistBox.setOptions({
                    add: (e) => {
                        // hack for 'after item added' event
                        e.sender.dataSource.one("change", (e) => {
                            this.toggleAction();
                        });
                    },
                    remove: (e) => {
                        // hack for 'after item removed' event
                        e.sender.dataSource.one("change", (e) => {
                            this.toggleAction();
                        });
                    },
                    reorder: (e) => {
                        e.preventDefault();
                    },
                });
                // selected sort column listbox
                this.selectedColumnlistBox.setOptions({
                    add: (e) => {
                        // hack for 'after item added' event
                        e.sender.dataSource.one("change", (e) => {
                            this.initSortOrderControl(e.items, true);
                            this.toggleAction();
                        });
                    },
                    remove: (e) => {
                        // hack for 'after item removed' event
                        e.sender.dataSource.one("change", (e) => {
                            this.toggleAction();
                        });
                    },
                    reorder: (e) => {
                        // prevent the default event handled by kendo
                        e.preventDefault();
                        // handle the reorder using custom logic, since kendo's inbuilt reorder event makes the sort order button go undefined
                        var dataSource = e.sender.dataSource;
                        for (var i = 0; i < e.dataItems.length; i++) {
                            var dataItem = e.dataItems[i];
                            var sortOrder = this.getSortOrder(dataItem);
                            var index = dataSource.indexOf(dataItem) + e.offset;
                            // manually re order the item
                            dataSource.remove(dataItem);
                            dataSource.insert(index, dataItem);
                            //persist the current selected sort order
                            var sortOrderControl = this.getSortOrderControl(dataItem.columnValue);
                            if (sortOrderControl) {
                                sortOrderControl.select(sortOrder);
                            }
                        }
                        //persist the selected items
                        for (var i = 0; i < e.dataItems.length; i++) {
                            var dataItem = e.dataItems[i];
                            e.sender.wrapper.find("[data-uid='" + dataItem.uid + "']").addClass("k-state-selected");
                        }
                    },
                    dataBound: (e) => {
                        var items = e.sender.dataSource.data();
                        this.initSortOrderControl(items, false);
                        this.toggleAction();
                    }
                });
                // apply sort button
                $(this.componentVariable.applyAdvancedSortSelector).click(() => {
                    this.applySort();
                });
                // reset sort button
                $(this.componentVariable.resetAdvancedSortSelector).click(() => {
                    this.refreshDataSource();
                });
                // clear sort button
                $(this.componentVariable.clearAdvancedSortSelector).click(() => {
                    this.availableColumnlistBox.setDataSource(this.componentVariable.colFieldMap);
                    this.selectedColumnlistBox.setDataSource(new Array());
                });
            };
            this.refreshDataSource = () => {
                this.availableColumnlistBox.setDataSource(this.service.availableColumns);
                this.selectedColumnlistBox.setDataSource(this.service.sortColumns);
            };
            this.toggleAction = () => {
                var selectedItems = this.selectedColumnlistBox.dataSource.data();
                $("#clearAdvancedSort").prop('disabled', selectedItems.length === 0);
                $("#resetAdvancedSort").prop('disabled', this.arrayEqual(selectedItems, this.service.sortColumns));
            };
            this.getSortOrder = (dataItem) => {
                var currentSortOrder = dataItem.sortOrder;
                var sortOrderControl = this.getSortOrderControl(dataItem.columnValue);
                if (sortOrderControl) {
                    currentSortOrder = sortOrderControl.current().index();
                }
                return currentSortOrder;
            };
            this.getSortOrderControl = (columnValue) => {
                var controlId = this.getSortOrderControlId(columnValue);
                return $(controlId).data("kendoButtonGroup");
            };
            this.getSortOrderControlId = (columnValue) => {
                return "#advanced-sort-order-" + this.escapeSelector(columnValue);
            };
            this.escapeSelector = (columnValue) => {
                return columnValue.replace(/([$%&()*+,./:;<=>?@\[\\\]^\{|}~])/g, '\\$1');
            };
            this.arrayEqual = (a, b) => {
                if (a === b)
                    return true;
                if (a == null || b == null)
                    return false;
                if (a.length !== b.length)
                    return false;
                for (var i = 0; i < a.length; ++i) {
                    if (!this.isEqual(a[i], b[i]))
                        return false;
                }
                return true;
            };
            this.componentVariable = componentVariable;
            this.service = new AdvancedSortService_1.AdvancedSortService(this.componentVariable);
        }
        get sortPopupWindow() {
            return this.componentVariable.sortPopupWindow.data("kendoWindow");
        }
        get selectedColumnlistBox() {
            var control = $(this.componentVariable.selectedColumnListBoxSelector).data("kendoListBox");
            if (!control) {
                control = $(this.componentVariable.selectedColumnListBoxSelector).kendoListBox({
                    "connectWith": "advanced-sort-available",
                    "dataTextField": "columnName",
                    "dataValueField": "columnValue",
                    "dropSources": ["advanced-sort-available"],
                    "template": $('#selected-sort-column-template').html(),
                    "toolbar": {
                        "position": "right",
                        "tools": ["moveUp", "moveDown"]
                    },
                    "draggable": {
                        "enabled": true
                    },
                    "selectable": "single"
                }).data("kendoListBox");
            }
            return control;
        }
        get availableColumnlistBox() {
            var control = $(this.componentVariable.availableColumnListBoxSelector).data("kendoListBox");
            if (!control) {
                control = $(this.componentVariable.availableColumnListBoxSelector).kendoListBox({
                    "connectWith": "advanced-sort-selected",
                    "dataTextField": "columnName",
                    "dataValueField": "columnValue",
                    "dropSources": ["advanced-sort-selected"],
                    "toolbar": {
                        "position": "right",
                        "tools": ["transferTo", "transferFrom", "transferAllTo", "transferAllFrom"]
                    },
                    "draggable": {
                        "enabled": true
                    },
                    "selectable": "multiple"
                }).data("kendoListBox");
            }
            return control;
        }
        initSortOrderControl(items, isAdd) {
            for (var i = 0; i < items.length; i++) {
                var columnValue = items[i].columnValue;
                var sortOrder = items[i].sortOrder;
                if (columnValue) {
                    var sortOrderControl = this.getSortOrderControl(columnValue);
                    if (!sortOrderControl) {
                        sortOrderControl = $(this.getSortOrderControlId(columnValue))
                            .kendoButtonGroup({ index: 0 })
                            .data("kendoButtonGroup");
                        if (sortOrderControl) {
                            sortOrderControl.select(isAdd ? 0 : sortOrder);
                        }
                    }
                }
            }
        }
        isEqual(a, b) {
            return a.columnValue === b.columnValue
                && a.columnName === b.columnName
                && a.sortOrder === b.sortOrder
                && a.sortPosition === b.sortPosition;
        }
    }
    exports.AdvancedSortController = AdvancedSortController;
});
define("AdvancedSort/AdvancedSortMain", ["require", "exports", "AdvancedSort/AdvancedSortController", "AdvancedSort/AdvancedSortEntities"], function (require, exports, AdvancedSortController_1, AdvancedSortEntities_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AdvancedSort {
        constructor(gridName, excludedColumn) {
            this.controller = null;
            this.componentVariable = null;
            this.componentVariable = new AdvancedSortEntities_2.AdvancedSortEntities.ComponentVariable(gridName, excludedColumn);
            this.controller = new AdvancedSortController_1.AdvancedSortController(this.componentVariable);
            this.onLoad();
        }
        onLoad() {
            // map the available grid columns to a collection
            this.componentVariable.grid.columns.map((c, ci) => {
                if (typeof c.field != "undefined" && typeof c.title != "undefined") {
                    //skip for excluded column
                    if (this.componentVariable.excludedColumn.includes(c.field, 0)) {
                        return;
                    }
                    var colField = new AdvancedSortEntities_2.AdvancedSortEntities.SortColumn({
                        columnName: c.title,
                        columnValue: c.field,
                        sortOrder: 0,
                        sortPosition: undefined
                    });
                    this.componentVariable.colFieldMap.push(colField);
                }
            });
            // wire button events
            if (!this.componentVariable.openPopupButton.isBoundToEvent('click')) {
                this.componentVariable.openPopupButton.click(() => this.controller.openPopup());
            }
            if (!this.componentVariable.clearSortButton.isBoundToEvent('click')) {
                this.componentVariable.clearSortButton.click(() => this.controller.clearSort());
            }
        }
    }
    exports.AdvancedSort = AdvancedSort;
});
