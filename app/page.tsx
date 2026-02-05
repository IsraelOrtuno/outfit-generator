"use client";
import { useState, useEffect } from "react";
import AvatarUploadPage from "@/components/upload";

export default function Home() {
  const [clothes, setClothes] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchClothes = async () => {
      const response = await fetch("/api/clothes");
      const json = await response.json();
      console.log(json.data);
      setClothes(json.data);
      setIsFetched(true);
    };

    fetchClothes();
  }, []);

  if (!isFetched) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1>Outfit Generator</h1>
      <p>Welcome to the Outfit Generator app!</p>

      {isFetched &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clothes.map((item: any) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={item.id} src={item.file} alt="Clothing item" />
        ))}

      <AvatarUploadPage />
    </main>
  );
}
