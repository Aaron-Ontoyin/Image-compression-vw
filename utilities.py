from PIL import Image, ImageOps


def compress_image(
    output_path,
    image_format,
    compression_magnitude,
    resolution: tuple,
    meta_data_preservation,
    color_space,
    img: Image,
):
    try:
        # Apply compression magnitude (quality) if applicable
        if image_format.lower() in ("jpg", "jpeg", "webp", "gif"):
            img = img.convert("RGB")
            img.save(output_path, format=image_format, quality=compression_magnitude)
        else:
            img.save(output_path, format=image_format)

        # Apply resolution if applicable
        if resolution.lower() == "reduce":
            img = img.resize(resolution, Image.ANTIALIAS)
            img.save(output_path, format=image_format)

        # Apply metadata preservation
        if meta_data_preservation.lower() == "strip":
            img = ImageOps.exif_transpose(img)
            img.save(output_path, format=image_format)

        # Apply color space conversion if applicable
        if color_space.lower() == "grayscale":
            img = img.convert("L")
            img.save(output_path, format=image_format)
        elif color_space.lower() == "ymck":
            img = img.convert("CMYK")
            img.save(output_path, format=image_format)

    except Exception as e:
        print(f"Error: {e}")
        return e

    return img
