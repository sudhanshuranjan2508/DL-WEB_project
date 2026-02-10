import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export class AIProctorService {
  private detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize the face detector
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'tfjs' as const,
      };
      
      this.detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
      this.isInitialized = true;
      console.log('✓ AI Proctor Service initialized');
    } catch (error) {
      console.error('Error initializing AI Proctor:', error);
      throw error;
    }
  }

  async detectFaces(video: HTMLVideoElement) {
    if (!this.detector || !this.isInitialized) {
      throw new Error('Detector not initialized');
    }

    try {
      const predictions = await this.detector.estimateFaces(video);
      return predictions;
    } catch (error) {
      console.error('Error detecting faces:', error);
      return [];
    }
  }

  async analyzeBehavior(video: HTMLVideoElement) {
    const faces = await this.detectFaces(video);
    const warnings: Array<{ reason: string; severity: string }> = [];

    // Check for multiple faces
    if (faces.length > 1) {
      warnings.push({
        reason: 'Multiple faces detected',
        severity: 'high'
      });
    }

    // Check if no face is detected
    if (faces.length === 0) {
      warnings.push({
        reason: 'No face detected - student may be looking away',
        severity: 'medium'
      });
    }

    // Analyze face position and orientation
    if (faces.length === 1) {
      const face = faces[0];
      
      // Check if face is too far from camera (simple heuristic based on keypoints)
      if (face.keypoints && face.keypoints.length > 0) {
        // Calculate bounding box size as a rough measure of distance
        const xs = face.keypoints.map(kp => kp.x);
        const ys = face.keypoints.map(kp => kp.y);
        const width = Math.max(...xs) - Math.min(...xs);
        const height = Math.max(...ys) - Math.min(...ys);
        
        // If face is too small (far away)
        if (width < 50 || height < 50) {
          warnings.push({
            reason: 'Student appears too far from camera',
            severity: 'low'
          });
        }
      }
    }

    return {
      faceCount: faces.length,
      warnings,
      timestamp: new Date().toISOString()
    };
  }

  dispose() {
    if (this.detector) {
      // Clean up resources
      this.isInitialized = false;
      console.log('✓ AI Proctor Service disposed');
    }
  }
}

export const proctorService = new AIProctorService();
