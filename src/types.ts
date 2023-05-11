export type SimpleSpecDesign = {
  /**
   * The color of the line, or the outline of point/polygon
   */
  strokeColor?: string;

  /**
   * The opacity of the line, or the outline of point/polygon
   */
  strokeOpacity?: number;

  /**
   * The width of the line, or the outline of point/polygon
   */
  strokeWidth?: number;

  /**
   * The color of the fill of point/polygon
   */
  fillColor?: string;

  /**
   * The opacity of the fill of point/polygon
   */
  fillOpacity?: number;
};

export type SimpleSpecLabel = {
  title?: string;
  description?: string;
};

export type Properties = Record<string, any>;
