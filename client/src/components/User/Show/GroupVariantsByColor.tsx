const GroupVariantsByColor = (variants: any) => {
  const colorGroups = variants.reduce((groups: any, variant: any) => {
    const colorAttr = variant.attribute_values.find(
      (attr: any) => attr.attribute.slug === "color"
    );
    const color = colorAttr ? colorAttr.value : "Unknown";

    if (!groups[color]) {
      groups[color] = {
        color,
        representativeImage: variant.image || null,
      };
    }

    if (variant.image) {
      groups[color].representativeImage = variant.image;
    }

    return groups;
  }, {});

  return Object.values(colorGroups);
};

export default GroupVariantsByColor;
