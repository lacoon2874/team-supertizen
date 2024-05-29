type ImageType = {
  url: string;
};

export async function createImage(images: ImageType[]) {
  const createImages = images.map(async (image) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.src = image.url;
    await img.decode();
    return img;
  });

  const imageArr = await Promise.all(createImages);
  const canvas = document.createElement("canvas");

  const width = window.innerWidth;
  const height = window.innerHeight * 0.49;

  canvas.width = width;
  canvas.height = height;

  imageArr.map((image, idx) => {
    const imageCtx = canvas.getContext("2d");
    imageCtx.drawImage(
      image,
      [50, 200, 50, 200][idx],
      [50, 50, 200, 200][idx],
      100,
      100
    );
  });

  const clothesImage = canvas.toDataURL("image/png");
  console.log(clothesImage);
  // useApi()
}
