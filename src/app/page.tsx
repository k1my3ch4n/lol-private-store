"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ImagePreview } from "@/components/ImagePreview";
import { DataTable } from "@/components/DataTable";
import { GameData } from "@/lib/types";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File, previewUrl: string) => {
    setSelectedFile(file);
    setPreview(previewUrl);
    setMimeType(file.type);
    setExtractedData(null);
    setError(null);

    // Base64 추출
    const base64Data = previewUrl.split(",")[1];
    setBase64(base64Data);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setBase64(null);
    setMimeType(null);
    setExtractedData(null);
    setError(null);
  };

  const handleExtract = async () => {
    if (!base64 || !mimeType) return;

    setIsExtracting(true);
    setError(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64, mimeType }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setExtractedData(result.data);
      } else {
        setError(result.error || "데이터 추출에 실패했습니다.");
        if (result.rawResponse) {
          console.log("Raw Response:", result.rawResponse);
        }
      }
    } catch (err) {
      console.error("추출 실패:", err);
      setError("데이터 추출 중 오류가 발생했습니다.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDataChange = (newData: GameData) => {
    setExtractedData(newData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
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
            <>
              <ImagePreview
                preview={preview}
                fileName={selectedFile?.name || ""}
                onRemove={handleRemove}
                onExtract={handleExtract}
                isExtracting={isExtracting}
              />

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                  {error}
                </div>
              )}

              {extractedData && (
                <DataTable
                  data={extractedData}
                  onChange={handleDataChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
