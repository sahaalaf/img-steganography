import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const App = () => {
    const [coverImage, setCoverImage] = useState(null);
    const [secretImage, setSecretImage] = useState(null);
    const [encodedImage, setEncodedImage] = useState(null);
    const [decodedImage, setDecodedImage] = useState(null);

    // Dropzone for Cover Image
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/png, image/jpeg",
        onDrop: (acceptedFiles) => setCoverImage(acceptedFiles[0]),
    });

    // Dropzone for Secret Image
    const { getRootProps: getSecretProps, getInputProps: getSecretInputProps } = useDropzone({
        accept: "image/png, image/jpeg",
        onDrop: (acceptedFiles) => setSecretImage(acceptedFiles[0]),
    });

    // Encode Image
    const handleEncode = async () => {
        if (!coverImage || !secretImage) {
            alert("Please upload both images.");
            return;
        }

        const formData = new FormData();
        formData.append("cover", coverImage);
        formData.append("secret", secretImage);

        const response = await fetch("http://127.0.0.1:5000/encode", {
            method: "POST",
            body: formData,
        });

        const blob = await response.blob();
        setEncodedImage(URL.createObjectURL(blob));
    };

    // Decode Image
    const handleDecode = async () => {
        if (!encodedImage) {
            alert("Please upload an encoded image.");
            return;
        }

        const formData = new FormData();
        formData.append("encoded", await fetch(encodedImage).then((res) => res.blob()));

        const response = await fetch("http://127.0.0.1:5000/decode", {
            method: "POST",
            body: formData,
        });

        const blob = await response.blob();
        setDecodedImage(URL.createObjectURL(blob));
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h2 className="text-4xl font-bold text-blue-600 mb-6">Image Steganography</h2>

            <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div {...getRootProps()} className="p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer text-center">
                        <input {...getInputProps()} />
                        <p className="text-gray-600">{coverImage ? coverImage.name : "Drag & Drop Cover Image"}</p>
                    </div>

                    <div {...getSecretProps()} className="p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer text-center">
                        <input {...getSecretInputProps()} />
                        <p className="text-gray-600">{secretImage ? secretImage.name : "Drag & Drop Secret Image"}</p>
                    </div>
                </div>

                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-5" onClick={handleEncode}>
                    Encode & Download
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {coverImage && (
                        <div>
                            <h3 className="text-lg font-medium">Original Cover Image</h3>
                            <img src={URL.createObjectURL(coverImage)} alt="Cover" className="w-full rounded-lg mt-2" />
                        </div>
                    )}

                    {secretImage && (
                        <div>
                            <h3 className="text-lg font-medium">Secret Image</h3>
                            <img src={URL.createObjectURL(secretImage)} alt="Secret" className="w-full rounded-lg mt-2" />
                        </div>
                    )}
                </div>

                {encodedImage && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium">Encoded Image (With Hidden Secret)</h3>
                        <img src={encodedImage} alt="Encoded" className="w-full rounded-lg mt-2" />
                        <a href={encodedImage} download="encoded.png" className="block text-blue-500 mt-2 text-center">
                            Download Encoded Image
                        </a>
                    </div>
                )}

                {encodedImage && (
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg w-full mt-5" onClick={handleDecode}>
                        Decode Image
                    </button>
                )}

                {decodedImage && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium">Extracted Secret Image</h3>
                        <img src={decodedImage} alt="Decoded" className="w-full rounded-lg mt-2" />
                        <a href={decodedImage} download="extracted.png" className="block text-green-500 mt-2 text-center">
                            Download Extracted Image
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
