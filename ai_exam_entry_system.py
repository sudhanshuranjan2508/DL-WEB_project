#!/usr/bin/env python3
"""
AI-Powered Exam Entry System
A comprehensive system for managing student exams with AI-based features
"""

import json
import hashlib
import datetime
import uuid
import os
import secrets
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum


class ExamStatus(Enum):
    """Enum for exam status"""
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class StudentStatus(Enum):
    """Enum for student status"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


@dataclass
class Student:
    """Student data model"""
    student_id: str
    name: str
    email: str
    password_hash: str
    salt: str
    status: StudentStatus = StudentStatus.ACTIVE
    created_at: str = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.datetime.now().isoformat()


@dataclass
class Exam:
    """Exam data model"""
    exam_id: str
    title: str
    description: str
    duration_minutes: int
    max_score: float
    scheduled_time: str
    status: ExamStatus = ExamStatus.SCHEDULED
    created_by: str = None
    created_at: str = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.datetime.now().isoformat()


@dataclass
class ExamEntry:
    """Exam entry record for a student"""
    entry_id: str
    student_id: str
    exam_id: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    score: Optional[float] = None
    ai_proctoring_flags: List[str] = None
    status: str = "registered"
    
    def __post_init__(self):
        if self.ai_proctoring_flags is None:
            self.ai_proctoring_flags = []


class AIExamEntrySystem:
    """
    Main class for the AI-powered exam entry system
    Handles student management, exam scheduling, and AI-based proctoring
    """
    
    def __init__(self, storage_file: str = "exam_system_data.json"):
        """Initialize the exam entry system"""
        self.storage_file = storage_file
        self.students: Dict[str, Student] = {}
        self.exams: Dict[str, Exam] = {}
        self.exam_entries: Dict[str, ExamEntry] = {}
        self.load_data()
    
    def _hash_password(self, password: str, salt: str = None) -> Tuple[str, str]:
        """
        Hash a password using PBKDF2-HMAC with SHA-256
        
        Args:
            password: Plain text password
            salt: Optional salt (generated if not provided)
        
        Returns:
            Tuple of (password_hash, salt)
        """
        if salt is None:
            # Generate a cryptographically secure random salt
            salt = secrets.token_hex(32)
        
        # Use PBKDF2-HMAC with 100,000 iterations for password hashing
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        ).hex()
        
        return password_hash, salt
    
    def register_student(self, name: str, email: str, password: str) -> Tuple[bool, str]:
        """
        Register a new student in the system
        
        Args:
            name: Student's full name
            email: Student's email address
            password: Student's password (will be hashed)
        
        Returns:
            Tuple of (success: bool, message: str)
        """
        # Check if email already exists
        for student in self.students.values():
            if student.email == email:
                return False, "Email already registered"
        
        # Create new student
        student_id = str(uuid.uuid4())
        password_hash, salt = self._hash_password(password)
        
        student = Student(
            student_id=student_id,
            name=name,
            email=email,
            password_hash=password_hash,
            salt=salt
        )
        
        self.students[student_id] = student
        self.save_data()
        
        return True, f"Student registered successfully with ID: {student_id}"
    
    def authenticate_student(self, email: str, password: str) -> Tuple[bool, Optional[str]]:
        """
        Authenticate a student
        
        Args:
            email: Student's email
            password: Student's password
        
        Returns:
            Tuple of (success: bool, student_id: Optional[str])
        """
        for student_id, student in self.students.items():
            if student.email == email:
                # Hash the provided password with the stored salt
                password_hash, _ = self._hash_password(password, student.salt)
                
                if student.password_hash == password_hash:
                    if student.status == StudentStatus.ACTIVE:
                        return True, student_id
                    else:
                        return False, None
        
        return False, None
    
    def create_exam(self, title: str, description: str, duration_minutes: int, 
                   max_score: float, scheduled_time: str, created_by: str = "admin") -> str:
        """
        Create a new exam
        
        Args:
            title: Exam title
            description: Exam description
            duration_minutes: Duration of exam in minutes
            max_score: Maximum score possible
            scheduled_time: ISO format datetime string for exam schedule
            created_by: ID of user creating the exam
        
        Returns:
            exam_id: Unique identifier for the created exam
        """
        exam_id = str(uuid.uuid4())
        
        exam = Exam(
            exam_id=exam_id,
            title=title,
            description=description,
            duration_minutes=duration_minutes,
            max_score=max_score,
            scheduled_time=scheduled_time,
            created_by=created_by
        )
        
        self.exams[exam_id] = exam
        self.save_data()
        
        return exam_id
    
    def register_student_for_exam(self, student_id: str, exam_id: str) -> Tuple[bool, str]:
        """
        Register a student for an exam
        
        Args:
            student_id: Student's unique ID
            exam_id: Exam's unique ID
        
        Returns:
            Tuple of (success: bool, message: str)
        """
        # Validate student exists
        if student_id not in self.students:
            return False, "Student not found"
        
        # Validate exam exists
        if exam_id not in self.exams:
            return False, "Exam not found"
        
        # Check if student is already registered
        for entry in self.exam_entries.values():
            if entry.student_id == student_id and entry.exam_id == exam_id:
                return False, "Student already registered for this exam"
        
        # Create exam entry
        entry_id = str(uuid.uuid4())
        exam_entry = ExamEntry(
            entry_id=entry_id,
            student_id=student_id,
            exam_id=exam_id
        )
        
        self.exam_entries[entry_id] = exam_entry
        self.save_data()
        
        return True, f"Student registered for exam successfully. Entry ID: {entry_id}"
    
    def start_exam(self, student_id: str, exam_id: str) -> Tuple[bool, str]:
        """
        Start an exam for a student
        
        Args:
            student_id: Student's unique ID
            exam_id: Exam's unique ID
        
        Returns:
            Tuple of (success: bool, message: str)
        """
        # Find the exam entry
        entry = None
        for exam_entry in self.exam_entries.values():
            if exam_entry.student_id == student_id and exam_entry.exam_id == exam_id:
                entry = exam_entry
                break
        
        if not entry:
            return False, "No exam registration found for this student"
        
        if entry.start_time:
            return False, "Exam already started"
        
        # Start the exam
        entry.start_time = datetime.datetime.now().isoformat()
        entry.status = "in_progress"
        
        # Update exam status if this is the first student
        if self.exams[exam_id].status == ExamStatus.SCHEDULED:
            self.exams[exam_id].status = ExamStatus.IN_PROGRESS
        
        self.save_data()
        
        return True, "Exam started successfully"
    
    def submit_exam(self, student_id: str, exam_id: str, score: float) -> Tuple[bool, str]:
        """
        Submit an exam for a student
        
        Args:
            student_id: Student's unique ID
            exam_id: Exam's unique ID
            score: Score obtained by the student
        
        Returns:
            Tuple of (success: bool, message: str)
        """
        # Find the exam entry
        entry = None
        for exam_entry in self.exam_entries.values():
            if exam_entry.student_id == student_id and exam_entry.exam_id == exam_id:
                entry = exam_entry
                break
        
        if not entry:
            return False, "No exam registration found for this student"
        
        if not entry.start_time:
            return False, "Exam not started yet"
        
        if entry.end_time:
            return False, "Exam already submitted"
        
        # Validate score
        exam = self.exams[exam_id]
        if score < 0:
            return False, "Score cannot be negative"
        if score > exam.max_score:
            return False, f"Score cannot exceed maximum score of {exam.max_score}"
        
        # Submit the exam
        entry.end_time = datetime.datetime.now().isoformat()
        entry.score = score
        entry.status = "completed"
        
        self.save_data()
        
        return True, f"Exam submitted successfully. Score: {score}/{exam.max_score}"
    
    def ai_proctor_flag(self, student_id: str, exam_id: str, flag_reason: str) -> Tuple[bool, str]:
        """
        Add an AI proctoring flag for suspicious behavior
        
        Args:
            student_id: Student's unique ID
            exam_id: Exam's unique ID
            flag_reason: Reason for the flag (e.g., "multiple faces detected", "looking away")
        
        Returns:
            Tuple of (success: bool, message: str)
        """
        # Find the exam entry
        entry = None
        for exam_entry in self.exam_entries.values():
            if exam_entry.student_id == student_id and exam_entry.exam_id == exam_id:
                entry = exam_entry
                break
        
        if not entry:
            return False, "No exam registration found for this student"
        
        # Add the flag with timestamp
        flag = f"{datetime.datetime.now().isoformat()}: {flag_reason}"
        entry.ai_proctoring_flags.append(flag)
        
        self.save_data()
        
        return True, "Proctoring flag added"
    
    def get_student_exams(self, student_id: str) -> List[Dict]:
        """
        Get all exams for a student
        
        Args:
            student_id: Student's unique ID
        
        Returns:
            List of exam information dictionaries
        """
        student_exams = []
        
        for entry in self.exam_entries.values():
            if entry.student_id == student_id:
                exam = self.exams.get(entry.exam_id)
                if exam:
                    exam_info = {
                        "exam": asdict(exam),
                        "entry": asdict(entry)
                    }
                    student_exams.append(exam_info)
        
        return student_exams
    
    def get_exam_participants(self, exam_id: str) -> List[Dict]:
        """
        Get all participants for an exam
        
        Args:
            exam_id: Exam's unique ID
        
        Returns:
            List of participant information dictionaries
        """
        participants = []
        
        for entry in self.exam_entries.values():
            if entry.exam_id == exam_id:
                student = self.students.get(entry.student_id)
                if student:
                    participant_info = {
                        "student": {
                            "student_id": student.student_id,
                            "name": student.name,
                            "email": student.email
                        },
                        "entry": asdict(entry)
                    }
                    participants.append(participant_info)
        
        return participants
    
    def get_analytics(self) -> Dict:
        """
        Get system analytics
        
        Returns:
            Dictionary containing various analytics
        """
        total_students = len(self.students)
        total_exams = len(self.exams)
        total_entries = len(self.exam_entries)
        
        completed_exams = sum(1 for entry in self.exam_entries.values() if entry.status == "completed")
        in_progress_exams = sum(1 for entry in self.exam_entries.values() if entry.status == "in_progress")
        
        flagged_entries = sum(1 for entry in self.exam_entries.values() if entry.ai_proctoring_flags)
        
        return {
            "total_students": total_students,
            "total_exams": total_exams,
            "total_entries": total_entries,
            "completed_exams": completed_exams,
            "in_progress_exams": in_progress_exams,
            "flagged_entries": flagged_entries
        }
    
    def save_data(self):
        """Save all data to storage file"""
        data = {
            "students": {sid: {
                **asdict(s),
                "status": s.status.value
            } for sid, s in self.students.items()},
            "exams": {eid: {
                **asdict(e),
                "status": e.status.value
            } for eid, e in self.exams.items()},
            "exam_entries": {eid: asdict(e) for eid, e in self.exam_entries.items()}
        }
        
        try:
            with open(self.storage_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def load_data(self):
        """Load data from storage file"""
        try:
            with open(self.storage_file, 'r') as f:
                data = json.load(f)
            
            # Load students
            for sid, student_data in data.get("students", {}).items():
                student_data["status"] = StudentStatus(student_data["status"])
                self.students[sid] = Student(**student_data)
            
            # Load exams
            for eid, exam_data in data.get("exams", {}).items():
                exam_data["status"] = ExamStatus(exam_data["status"])
                self.exams[eid] = Exam(**exam_data)
            
            # Load exam entries
            for eid, entry_data in data.get("exam_entries", {}).items():
                self.exam_entries[eid] = ExamEntry(**entry_data)
                
        except FileNotFoundError:
            # No existing data file, start fresh
            pass
        except Exception as e:
            print(f"Error loading data: {e}")


def main():
    """Main function to demonstrate the system"""
    print("=" * 60)
    print("AI-Powered Exam Entry System")
    print("=" * 60)
    
    # Initialize the system
    system = AIExamEntrySystem()
    
    # Register students
    print("\n1. Registering Students...")
    success, msg = system.register_student("Alice Johnson", "alice@example.com", "password123")
    print(f"   {msg}")
    
    success, msg = system.register_student("Bob Smith", "bob@example.com", "password456")
    print(f"   {msg}")
    
    # Authenticate a student
    print("\n2. Authenticating Student...")
    success, student_id = system.authenticate_student("alice@example.com", "password123")
    if success:
        print(f"   Authentication successful! Student ID: {student_id}")
    
    # Create an exam
    print("\n3. Creating Exam...")
    scheduled_time = (datetime.datetime.now() + datetime.timedelta(days=1)).isoformat()
    exam_id = system.create_exam(
        title="Machine Learning Fundamentals",
        description="Final exam covering ML basics",
        duration_minutes=120,
        max_score=100.0,
        scheduled_time=scheduled_time
    )
    print(f"   Exam created with ID: {exam_id}")
    
    # Register students for exam
    print("\n4. Registering Students for Exam...")
    for sid in system.students.keys():
        success, msg = system.register_student_for_exam(sid, exam_id)
        print(f"   {msg}")
    
    # Start exam for a student
    print("\n5. Starting Exam for Alice...")
    alice_id = list(system.students.keys())[0]
    success, msg = system.start_exam(alice_id, exam_id)
    print(f"   {msg}")
    
    # Simulate AI proctoring
    print("\n6. AI Proctoring...")
    success, msg = system.ai_proctor_flag(alice_id, exam_id, "Multiple faces detected")
    print(f"   {msg}")
    
    # Submit exam
    print("\n7. Submitting Exam...")
    success, msg = system.submit_exam(alice_id, exam_id, 85.5)
    print(f"   {msg}")
    
    # Get analytics
    print("\n8. System Analytics...")
    analytics = system.get_analytics()
    for key, value in analytics.items():
        print(f"   {key}: {value}")
    
    print("\n" + "=" * 60)
    print("Demo completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
