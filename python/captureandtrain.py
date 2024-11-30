import cv2
import os
import numpy as np
import pickle
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

# --- Initialize Variables and Directories ---
training_data_dir = "training_data"
model_dir = "models"
os.makedirs(training_data_dir, exist_ok=True)
os.makedirs(model_dir, exist_ok=True)  # Make sure model directory exists

# Initialize the Haar Cascade and Recognizer
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
recognizer = cv2.face.LBPHFaceRecognizer_create()

# Global flag to control webcam capturing state
capture_flag = False

def capture_faces_and_train(user_id, limit=200):
    """
    Captures face images for the given user ID, saves them in a directory,
    and then trains the face recognition model. This function runs in a separate thread.
    """
    cap = cv2.VideoCapture(0)
    user_dir = os.path.join(training_data_dir, user_id)
    os.makedirs(user_dir, exist_ok=True)

    print(f"Capturing up to {limit} images for User ID: {user_id}")
    image_count = 0
    global capture_flag

    while capture_flag and image_count < limit:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))

        for (x, y, w, h) in faces:
            face = gray[y:y+h, x:x+w]
            cv2.imwrite(f"{user_dir}/face_{image_count}.jpg", face)
            image_count += 1
            print(f"Captured image {image_count}/{limit}")
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

        cv2.imshow("Face Capture", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Capture interrupted by user. Exiting.")
            break

    cap.release()
    cv2.destroyAllWindows()
    print(f"Saved {image_count} images to {user_dir}")

    if capture_flag:  # Only train if capture was not interrupted
        print(f"Training model for User ID: {user_id}")
        train_model()

@app.route('/start-capture', methods=['POST'])
def start_capture():
    """
    Starts capturing face images in a separate thread and then trains the model automatically.
    """
    global capture_flag
    user_id = request.json.get('user_id')
    limit = request.json.get('limit', 200)  # Get limit of images

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    capture_flag = True
    # Start webcam capture in a separate thread
    threading.Thread(target=capture_faces_and_train, args=(user_id, limit)).start()

    return jsonify({"message": "Started face capture. Training will start after capture."}), 200


@app.route('/stop-capture', methods=['POST'])
def stop_capture():
    """
    Stops the webcam capture process.
    """
    global capture_flag
    capture_flag = False  # Stop the webcam capture loop
    return jsonify({"message": "Stopped face capture."}), 200


def train_model():
    """
    Trains the face recognition model using the collected training data.
    """
    face_images = []
    face_labels = []
    label_to_user = {}

    print("Training the model...")

    # Iterate through each user directory and collect face images
    for user_id, user_dir in enumerate(os.listdir(training_data_dir)):
        user_path = os.path.join(training_data_dir, user_dir)
        label_to_user[user_id] = user_dir  # Map user_id to the user name

        for image_file in os.listdir(user_path):
            image_path = os.path.join(user_path, image_file)
            face_image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

            if face_image is not None:
                face_images.append(face_image)
                face_labels.append(user_id)

    if len(face_images) == 0:
        raise ValueError("No face images found to train the model.")

    # Train the recognizer
    recognizer.train(face_images, np.array(face_labels))
    print("Training completed!")

    # Save the trained model
    try:
        model_path = os.path.join(model_dir, 'trainer.yml')
        recognizer.save(model_path)
        print(f"Model saved successfully as '{model_path}'.")
    except cv2.error as e:
        print(f"Error saving model: {e}")
        raise

    # Save label to user mapping
    try:
        with open(os.path.join(model_dir, 'label_to_user.pkl'), 'wb') as f:
            pickle.dump(label_to_user, f)
        print("Label mapping saved as 'label_to_user.pkl'.")
    except Exception as e:
        print(f"Error saving label mapping: {e}")
        raise


@app.route('/clear-data', methods=['POST'])
def clear_data():
    """
    Clears training data, model, and label mappings.
    """
    # Remove the training data, model, and label mapping files
    for user_dir in os.listdir(training_data_dir):
        user_path = os.path.join(training_data_dir, user_dir)
        if os.path.isdir(user_path):
            for file in os.listdir(user_path):
                os.remove(os.path.join(user_path, file))
            os.rmdir(user_path)

    # Remove the trainer model and label file
    model_path = os.path.join(model_dir, 'trainer.yml')
    if os.path.exists(model_path):
        os.remove(model_path)
    if os.path.exists(os.path.join(model_dir, 'label_to_user.pkl')):
        os.remove(os.path.join(model_dir, 'label_to_user.pkl'))

    return jsonify({"message": "All data cleared successfully."}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)