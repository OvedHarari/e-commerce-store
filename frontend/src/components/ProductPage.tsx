import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SiteTheme } from "../App";
import { getProductById } from "../services/productsService";
import { addToCart } from "../services/cartService";
import { successMsg } from "../services/feedbacksService";
import Product from "../interfaces/Product";
import { getWishList } from "../services/wishListService";
// import ReactImageMagnify from 'react-image-magnify'


interface ProductPageProps {
    allProducts: any;
    setAllProducts: Function;
    userInfo: any;
    handleRegister: Function;
    handleaddToWishList: Function;
    handleAddToCart: Function;
    wishList: string[];
    setWishlist: Function;
    setLoading: Function;

}


const ProductPage: FunctionComponent<ProductPageProps> = ({ allProducts, setAllProducts, userInfo, handleRegister, handleaddToWishList, handleAddToCart, wishList, setWishlist, setLoading }) => {
    let navigate = useNavigate();
    let { productId } = useParams();
    let [product, setProduct] = useState<Product>()
    let theme = useContext(SiteTheme);

    let [images, setImages] = useState<string[]>([])


    let [img, setImg] = useState<string>()


    //************
    const hoverHandler = (image: string, index: any) => {
        setImg(image);

        if (refs.current.length > index && refs.current[index]) {
            refs.current[index].classList.add('active');

            for (var j = 0; j < refs.current.length; j++) {
                if (index !== j && refs.current[j]) {
                    refs.current[j].classList.remove('active');
                }
            }
        }
    };


    const refs = useRef<any[]>([]);
    refs.current = [];
    // const addRefs = () => {
    const addRefs = (el: any) => {
        if (el && !refs.current.includes(el)) {
            refs.current.push(el);
        }

    };




    useEffect(() => {
        if (productId) {
            getProductById(productId)
                .then((res) => {
                    setProduct(res.data)
                    setImages(res.data.images)
                    if (!img) { (setImg(images[images.length - 1])) }

                })

                .catch((err) => { console.log(err); }
                );
        }
    }, [setAllProducts, productId, images])

    useEffect(() => {
        setLoading(true)
        if (userInfo.userId) {
            getWishList(userInfo.userId)
                .then((res) => {
                    let defaultProductIds: string[] = res.data.products?.map((product: any) => product._id) || [];
                    setWishlist(defaultProductIds)
                })
                .catch((err) => console.log(err));
        }
    }, [setLoading, setWishlist, userInfo.userId]);

    // let handleAddToCart = (product: Product) => {
    //     addToCart(product)
    //         .then((res) => successMsg(` ${product.title} added to cart`))
    //         .catch((err) => console.log(err))
    // }
    return (<>
        {product && (
            <div className="container productContent">
                <div className="row ">
                    <div className="col d-flex justify-content-start ">
                        <div className="productImages ">
                            <div className="row left text-start">
                                <div className="left_2 ">
                                    <img className="productImg border rounded-3" src={img} alt="" style={{ width: "30rem", height: "30rem" }} />

                                </div>
                                <div className="left_1 mt-3 " style={{ width: "30rem", height: "5rem" }}>
                                    {images.map((image, index) => (
                                        <div className={`${index === 0 ? 'img_wrap active' : 'img_wrap'}`}
                                            key={index}

                                            onMouseOver={() => hoverHandler(image, index)}
                                            ref={addRefs}
                                        >
                                            <img className=" rounded-3 " src={image} alt="" />
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </div>

                    </div>
                    <div className="col productInfo text-start" style={{ height: "28rem" }}>
                        <h2>{`${product.title}`}</h2>
                        <div className="row " style={{ width: "10rem" }}>
                            {userInfo.email !== false ? (


                                <>
                                    <div className="col-4 left-icons text-center">
                                        <button className="btn addToCart-btn-admin" onClick={() => handleAddToCart(product)} ><i className="fa-solid fa-cart-shopping"></i></button>
                                    </div>

                                    {userInfo.email !== false && (wishList.includes(product._id as string) ? (
                                        <div className="col-4 right-icons text-center">
                                            <button className="btn col text-danger" onClick={() => {
                                                handleaddToWishList(product);
                                            }}    >
                                                <i className="fa-solid fa-heart"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="col-4 right-icons text-center">
                                            <button className="btn col" onClick={() => { handleaddToWishList(product); }}    >
                                                <i className="fa-solid fa-heart"></i>
                                            </button>
                                        </div>
                                    )
                                    )}

                                </>

                            ) : (

                                <>
                                    <div className="col-4 left-icons text-center">
                                        <button className="btn addToCart-btn-admin" onClick={() => { handleRegister() }} ><i className="fa-solid fa-cart-shopping"></i></button>
                                    </div>
                                    <div className="col-4 right-icons text-center">
                                        {(wishList.includes(product._id as string) ? (
                                            <button className="btn col-4 ddToCart-btn-admin text-danger" onClick={() => {
                                                handleRegister();
                                            }}    >
                                                <i className="fa-solid fa-heart"></i>
                                            </button>
                                        ) : (
                                            <button className="btn col-4 ddToCart-btn-admin text-center" onClick={() => { handleRegister(); }}    >
                                                <i className="fa-solid fa-heart"></i>
                                            </button>)
                                        )}
                                    </div>
                                </>

                            )}
                        </div>
                        <div className="productDescription container-full ">
                            <h6 className="productDescTitle mt-5">Description:</h6>
                            <p >{`${product.description}`} </p>


                        </div>
                        <h5 className="mt-5 ">Price: {`${product.price}`} &#8362;</h5>


                    </div>

                </div>
            </div>
        )}
        {/* <div className="  backBtn">
            <button className="btn btn-outline-info" onClick={() => navigate(-1)}>Go Back</button>
        </div> */}
    </>);
}

export default ProductPage;