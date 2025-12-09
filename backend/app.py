import os
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from db import get_db_connection, init_db
import mysql.connector

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize DB on start
init_db()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/documents/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Avoid overwriting files with same name by appending timestamp or uuid if needed
        # For simplicity, we'll generic logic or expect unique names, 
        # but let's just prepend a simple check or uniqueness logic if specific requirement.
        # User requirement: "Store files locally".
        
        # To make it robust, let's prepend a unique identifier or just trust secure_filename for now
        # but what if two people upload 'test.pdf'? 
        # Let's append some random chars or check existence. 
        # For this "simple" app, let's just save.
        
        # Actually, let's start with simple save.
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Handle duplicates by renaming? Or just overwrite?
        # Requirement: "unique secure filename" in design. 
        # Let's import uuid to allow unique saves.
        import uuid
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
        
        file.save(save_path)
        file_size = os.path.getsize(save_path)

        # Save metadata to DB
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            query = "INSERT INTO documents (filename, filepath, filesize) VALUES (%s, %s, %s)"
            cursor.execute(query, (filename, unique_name, file_size))
            conn.commit()
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return jsonify({
                'message': 'File uploaded successfully',
                'document': {
                    'id': new_id,
                    'filename': filename,
                    'size': file_size
                }
            }), 201
        else:
            return jsonify({'error': 'Database connection failed'}), 500

    return jsonify({'error': 'Invalid file type. Only PDF allowed.'}), 400

@app.route('/documents', methods=['GET'])
def list_documents():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM documents ORDER BY created_at DESC")
        documents = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(documents)
    return jsonify({'error': 'Database connection failed'}), 500

@app.route('/documents/<int:doc_id>', methods=['GET'])
def download_document(doc_id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM documents WHERE id = %s", (doc_id,))
        doc = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if doc:
            # send_from_directory looks for file in the directory
            return send_from_directory(app.config['UPLOAD_FOLDER'], doc['filepath'], as_attachment=True, download_name=doc['filename'])
        else:
            return jsonify({'error': 'Document not found'}), 404
            
    return jsonify({'error': 'Database connection failed'}), 500

@app.route('/documents/<int:doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        # Get file path first to delete from disk
        cursor.execute("SELECT * FROM documents WHERE id = %s", (doc_id,))
        doc = cursor.fetchone()
        
        if doc:
            # Delete from DB
            cursor.execute("DELETE FROM documents WHERE id = %s", (doc_id,))
            conn.commit()
            cursor.close()
            conn.close()
            
            # Delete from disk
            full_path = os.path.join(app.config['UPLOAD_FOLDER'], doc['filepath'])
            if os.path.exists(full_path):
                os.remove(full_path)
                
            return jsonify({'message': 'File deleted successfully'})
        else:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Document not found'}), 404

    return jsonify({'error': 'Database connection failed'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
