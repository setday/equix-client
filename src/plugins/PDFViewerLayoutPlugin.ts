"use strict";

import type { Plugin } from "@react-pdf-viewer/core";
import React from "react";
import { DocumentLayout, LayoutBlock } from "../types";

export interface LayoutPlugin extends Plugin {}

export interface LayoutPluginProps {
  layout: DocumentLayout | null;
  renderLayoutBlock: (block: LayoutBlock) => React.ReactNode;
}

export function layoutPlugin(props?: LayoutPluginProps): LayoutPlugin {
  const renderPageLayer = function (renderPageProps: any) {
    const layoutBlocks = props?.layout?.blocks
      .filter((block) => block.page_number === renderPageProps.pageIndex)
      .map((block, _) => props.renderLayoutBlock(block));
    return React.createElement(React.Fragment, null, layoutBlocks);
  };
  return {
    renderPageLayer: renderPageLayer,
  };
}
