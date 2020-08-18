declare var $: any;

export module AdvancedSortEntities {
    export interface ISortColumn {
        columnName: string;
        columnValue: string;
        sortOrder: number;
        sortPosition: number;
    }

    export class SortColumn {
        columnName: string;
        columnValue: string;
        sortOrder: number;
        sortPosition: number;

        constructor(data: ISortColumn) {
            this.columnName = data.columnName;
            this.columnValue = data.columnValue;
            this.sortOrder = data.sortOrder;
            this.sortPosition = data.sortPosition;
        }
    }

    export class ComponentVariable {
        public gridName: string;
        public excludedColumn: Array<string>;

        public sortPopupWindow: any;
        public sortPopupWindowContent: any;

        public openPopupButtonSelector: string;
        public clearSortButtonSelector: string;
        public sortPopupUrlElementSelector: string;
        public availableColumnListBoxSelector: string;
        public selectedColumnListBoxSelector: string;
        public applyAdvancedSortSelector: string;
        public resetAdvancedSortSelector: string;
        public clearAdvancedSortSelector: string;
        public gridPanelSelector: string;

        public colFieldMap: Array<AdvancedSortEntities.SortColumn>;
        public isAdvancedSortApplied: boolean;
        
        constructor(gridName: string, excludedColumn: Array<string>) {
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

            this.colFieldMap = new Array<AdvancedSortEntities.SortColumn>();
            this.isAdvancedSortApplied = false;
        }

        public get grid(): any {
            return $(this.gridPanelSelector).data('kendoGrid');
        }

        public get openPopupButton(): any {
            return $(this.openPopupButtonSelector);
        }

        public get clearSortButton(): any {
            return $(this.clearSortButtonSelector);
        }

        public get sortPopupUrlElement(): any {
            return $(this.sortPopupUrlElementSelector);
        }

        public get sortPopupUrl(): any {
            return $(this.sortPopupUrlElementSelector).prop('href');
        }
    }
}