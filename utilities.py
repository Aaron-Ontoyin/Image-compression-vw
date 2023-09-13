from PIL import Image, ImageOps


def compress_image(
    output_path,
    image_format,
    compression_magnitude,
    meta_data_preservation,
    color_space,
    img: Image,
    resolution=None,
):
    try:
        if image_format.lower() in ("jpg", "jpeg", "webp", "gif"):
            img = img.convert("RGB")
            img.save(output_path, format=image_format, quality=compression_magnitude)
        else:
            img.save(output_path, format=image_format)

        img = img.resize((resolution))
        img.save(output_path, format=image_format)

        if meta_data_preservation.lower() == "strip":
            img = ImageOps.exif_transpose(img)
            img.save(output_path, format=image_format)

        if color_space.lower() == "grayscale":
            img = img.convert("L")
            img.save(output_path, format=image_format)
        elif color_space.lower() == "ymck":
            img = img.convert("CMYK")
            img.save(output_path, format=image_format)

    except Exception as e:
        return e

    return img
