import os
import sys
import numpy as np
import cv2 as cv
from mtcnn.mtcnn import MTCNN
from keras_facenet import FaceNet
from app.exception.execption import NetworkSecurityException


class FaceLoading:

    def __init__(self):
        self.target_size = (160, 160)
        self.detector = MTCNN()
        self.embedder = FaceNet()

    def extract_face(self, filename):
        try:
            img = cv.imread(filename)
            if img is None:
                raise ValueError("Image not found")

            img = cv.cvtColor(img, cv.COLOR_BGR2RGB)
            results = self.detector.detect_faces(img)

            if len(results) == 0:
                raise ValueError("No face detected")

            x, y, w, h = results[0]['box']

           
            x = max(0, x)
            y = max(0, y)

            face = img[y:y+h, x:x+w]
            face = cv.resize(face, self.target_size)

            return face

        except Exception as e:
            raise NetworkSecurityException(e, sys)

    def get_embedding(self, face_img):
        try:
            face_img = face_img.astype('float32')

            face_img = np.expand_dims(face_img, axis=0)
            embedding = self.embedder.embeddings(face_img)

            return embedding[0]

        except Exception as e:
            raise NetworkSecurityException(e, sys)
