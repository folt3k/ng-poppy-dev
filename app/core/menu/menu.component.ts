import { Component, OnInit } from '@angular/core';

export interface MenuItem {
  label: string;
  path: string;
  active?: boolean;
}

export type MenuSchema = MenuItem[];

@Component({
  selector: 'layout-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  schema: MenuSchema = [
    {
      label: 'Basic popover',
      path: 'base',
    },
    {
      label: 'Menu',
      path: 'menu',
      active: true,
    },
    {
      label: 'Nested menu',
      path: 'nested-menu',
    },
    {
      label: 'Context menu',
      path: 'context-menu',
    },
    {
      label: 'Tooltip',
      path: 'tooltip',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
