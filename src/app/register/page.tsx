"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageUploader } from "@/components/ImageUploader";
import { ImagePreview } from "@/components/ImagePreview";
import { DataTable } from "@/components/DataTable";
import { GameData } from "@/lib/types";

export default function RegisterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleSave = async () => {
    if (!extractedData) return;

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(extractedData),
      });

      const result = await response.json();

      if (result.success) {
        setSaveSuccess(true);
      } else {
        setError(result.error || "데이터 저장에 실패했습니다.");
      }
    } catch (err) {
      console.error("저장 실패:", err);
      setError("데이터 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">게임 등록</h1>
              <p className="text-muted-foreground mt-2">
                게임 결과 스크린샷을 업로드하여 데이터를 추출하고 저장하세요
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              홈으로
            </Link>
          </div>
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
                <>
                  <DataTable
                    data={extractedData}
                    onChange={handleDataChange}
                  />

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving || saveSuccess}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSaving ? "저장 중..." : saveSuccess ? "저장 완료" : "DB에 저장"}
                    </button>

                    {saveSuccess && (
                      <span className="text-green-600 font-medium">
                        데이터가 성공적으로 저장되었습니다!
                      </span>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
