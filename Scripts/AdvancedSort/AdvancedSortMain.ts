declare var $: any;

import { AdvancedSortController } from "./AdvancedSortController";
import { AdvancedSortEntities } from "./AdvancedSortEntities"

export class AdvancedSort {

    private controller: AdvancedSortController = null;
    private componentVariable: AdvancedSortEntities.ComponentVariable = null;

    constructor(gridName: string, excludedColumn: Array<string>) {
        this.componentVariable = new AdvancedSortEntities.ComponentVariable(gridName, excludedColumn);
        this.controller = new AdvancedSortController(this.componentVariable);
        this.onLoad();
    }

    private onLoad(): void {
        // map the available grid columns to a collection
        this.componentVariable.grid.columns.map(
            (c, ci) => {
                if (typeof c.field != "undefined" && typeof c.title != "undefined") {
                    //skip for excluded column
                    if (this.componentVariable.excludedColumn.includes(c.field, 0)) {
                        return;
                    }
                    var colField = new AdvancedSortEntities.SortColumn({
                        columnName: c.title,
                        columnValue: c.field,
                        sortOrder: 0,
                        sortPosition: undefined
                    });
                    this.componentVariable.colFieldMap.push(colField);
                }
            }
        );

        // wire button events
        if (!this.componentVariable.openPopupButton.isBoundToEvent('click')) {
            this.componentVariable.openPopupButton.click(() => this.controller.openPopup());
        }
        if (!this.componentVariable.clearSortButton.isBoundToEvent('click')) {
            this.componentVariable.clearSortButton.click(() => this.controller.clearSort());
        }
    }
}