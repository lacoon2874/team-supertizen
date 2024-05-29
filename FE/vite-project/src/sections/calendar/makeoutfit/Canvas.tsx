import React, { useRef, useEffect, useState } from "react";
import Konva from "konva";
import { Transformer, Layer, Stage, Text, Group, Image } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useSelectedItemsStore } from "@/store/ClothesStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface ShapeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
}

const IMG: React.FC<{
  image: HTMLImageElement;
  shapeProps: ShapeProps;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: ShapeProps) => void;
  onDelete: () => void;
}> = ({ image, shapeProps, isSelected, onSelect, onChange, onDelete }) => {
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected) {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer()?.batchDraw();
      }
    }
  }, [isSelected]);

  return (
    <Group>
      <Image
        image={image}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
      {isSelected && (
        <Text
          text="X"
          x={shapeProps.x + shapeProps.width}
          y={shapeProps.y - 10}
          onClick={onDelete}
          onTap={onDelete}
          draggable={false}
          fill="red"
          fontSize={20}
          padding={5}
          fontStyle="bold"
          cornerRadius={10}
          stroke={"black"}
          strokeWidth={1}
        />
      )}
    </Group>
  );
};

function Canvas() {
  const navigate = useNavigate();
  const { selectedItems, setConfirmOutfit } = useSelectedItemsStore();

  const stageRef = useRef<Konva.Stage>(null);
  const [loadedImages, setLoadedImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadImages = async () => {
    const imagesToLoad = selectedItems.map(async (item) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous"; // CORS 정책 준수를 위해 crossOrigin 설정
      img.src = item.url;
      await img.decode();
      return { id: item.id, image: img };
    });

    const loadedImagesArray = await Promise.all(imagesToLoad);
    const newLoadedImages = loadedImagesArray.reduce<{
      [key: string]: HTMLImageElement;
    }>((acc, { id, image }) => {
      acc[id] = image;
      return acc;
    }, {});
    setLoadedImages(newLoadedImages);
  };

  useEffect(() => {
    loadImages();
  }, [selectedItems]);

  const exportAndSaveImage = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      setConfirmOutfit(uri);
      navigate("/calendar/confirmoutfit");
    }
  };

  const checkDeselect = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleShapeChange = (index: number, newAttrs: ShapeProps) => {
    useSelectedItemsStore.setState((state) => {
      const updatedItems = [...state.selectedItems];
      updatedItems[index] = { ...updatedItems[index], ...newAttrs };
      return { selectedItems: updatedItems };
    });
  };

  const handleDelete = (id: string) => {
    useSelectedItemsStore.setState((state) => ({
      selectedItems: state.selectedItems.filter((item) => item.id !== id),
    }));
    setSelectedId(null);
  };

  return (
    <>
      <Button onClick={exportAndSaveImage}>확인</Button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight * 0.49}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        ref={stageRef}
        style={{ backgroundColor: "white" }}
      >
        <Layer>
          {selectedItems.map((item) => (
            <IMG
              key={item.id}
              image={loadedImages[item.id]}
              shapeProps={{
                ...item,
                isDragging: false,
              }}
              isSelected={item.id === selectedId}
              onSelect={() => {
                setSelectedId(item.id);
              }}
              onChange={(newAttrs) =>
                handleShapeChange(
                  selectedItems.findIndex((img) => img.id === item.id),
                  newAttrs
                )
              }
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
}

export default Canvas;

const Button = styled.button`
  position: absolute;
  top: 3dvh;
  right: 10px;
`;
