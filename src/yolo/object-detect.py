import sys
import json
from ultralytics import YOLO
import cv2
import numpy as np
import os
model_path = os.path.join(os.path.dirname(__file__), 'yolo11x.pt')
model = YOLO(model_path)

def detect_objects(image_path):
    image = cv2.imread(image_path)
    if image is None:
        return {"error": "No se pudo cargar la imagen"}

    # Realizar la detección con YOLO
    results = model(image, verbose=False)
    detections = []
    for result in results[0].boxes:
        box = result.xyxy[0].tolist()
        detections.append({
            "label": model.model.names[int(result.cls[0])],
            "confidence": float(result.conf[0]),
            "box": [int(coord) for coord in box]
        })
    return detections

if __name__ == "__main__":
    image_path = sys.argv[1]
    result = detect_objects(image_path)
    print(json.dumps(result))