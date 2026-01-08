"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImagePreviewProps {
  preview: string;
  fileName: string;
  onRemove: () => void;
  onExtract: () => void;
  isExtracting?: boolean;
}

export function ImagePreview({
  preview,
  fileName,
  onRemove,
  onExtract,
  isExtracting = false,
}: ImagePreviewProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <Image
            src={preview}
            alt="업로드된 이미지"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {fileName}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onRemove}>
              삭제
            </Button>
            <Button size="sm" onClick={onExtract} disabled={isExtracting}>
              {isExtracting ? "추출 중..." : "데이터 추출"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
