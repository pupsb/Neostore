import Gallery from "../models/ImageGallery.js";

export const getImages = async (req, res) => {
    try {

        const CarouselMb = await Gallery.find({type: 'CarouselMb'});
        const CarouselPc = await Gallery.find({type: 'CarouselPc'});
        const Popup = await Gallery.find({type: 'Popup'});

        res.status(200).json({CarouselMb: CarouselMb, CarouselPc: CarouselPc, Popup: Popup});
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
