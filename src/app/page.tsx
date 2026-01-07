"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ImagePreview } from "@/components/ImagePreview";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleImageSelect = (file: File, previewUrl: string) => {
    setSelectedFile(file);
    setPreview(previewUrl);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleExtract = async () => {
    if (!selectedFile) return;

    setIsExtracting(true);
    try {
      // TODO: Phase 3에서 구현
      console.log("데이터 추출 시작:", selectedFile.name);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Phase 3에서 Gemini API 연동 후 구현됩니다.");
    } catch (error) {
      console.error("추출 실패:", error);
      alert("데이터 추출에 실패했습니다.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">LoL 사설 게임 데이터 아카이브</h1>
          <p className="text-muted-foreground mt-2">
            게임 결과 스크린샷을 업로드하여 데이터를 추출하고 저장하세요
          </p>
        </header>

        <main className="space-y-6">
          {!preview ? (
            <ImageUploader onImageSelect={handleImageSelect} />
          ) : (
            <ImagePreview
              preview={preview}
              fileName={selectedFile?.name || ""}
              onRemove={handleRemove}
              onExtract={handleExtract}
              isExtracting={isExtracting}
            />
          )}
        </main>
      </div>
    </div>
  );
}
