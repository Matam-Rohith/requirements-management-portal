from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from mangum import Mangum
import uuid

SECRET_KEY = "rmp-super-secret-key-2024-matam-rohith"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480

app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

USERS_DB = {
    "admin":  {"username": "admin",  "full_name": "Admin User",  "role": "admin",  "hashed_password": pwd_context.hash("admin123")},
    "viewer": {"username": "viewer", "full_name": "Viewer User", "role": "viewer", "hashed_password": pwd_context.hash("viewer123")},
}

REQUIREMENTS: List[dict] = [
    {"id": "req-001", "title": "User Authentication Module", "description": "Implement JWT-based login and session management.", "priority": "Critical", "status": "Done",        "assignee": "admin",  "created_by": "admin", "created_at": "2024-03-01T09:00:00", "updated_at": "2024-03-10T15:00:00", "tags": ["auth", "security"]},
    {"id": "req-002", "title": "Requirements Dashboard",     "description": "Build a real-time dashboard showing stats and charts.",     "priority": "High",     "status": "In Progress", "assignee": "viewer", "created_by": "admin", "created_at": "2024-03-02T10:00:00", "updated_at": "2024-03-12T11:00:00", "tags": ["dashboard"]},
    {"id": "req-003", "title": "Export to PDF/CSV",          "description": "Allow export of requirements list for reporting.",         "priority": "Medium",   "status": "Open",        "assignee": "admin",  "created_by": "viewer", "created_at": "2024-03-05T08:00:00", "updated_at": "2024-03-05T08:00:00", "tags": ["export"]},
    {"id": "req-004", "title": "Email Notifications",        "description": "Send alerts when requirement status changes.",           "priority": "Low",      "status": "Open",        "assignee": "viewer", "created_by": "admin", "created_at": "2024-03-06T14:00:00", "updated_at": "2024-03-06T14:00:00", "tags": ["notifications"]},
    {"id": "req-005", "title": "Audit Trail",                 "description": "Log all changes with timestamp and user info.",          "priority": "Critical", "status": "In Progress", "assignee": "admin",  "created_by": "admin", "created_at": "2024-03-07T09:30:00", "updated_at": "2024-03-13T10:00:00", "tags": ["audit"]},
]

# ---- Models ----
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    full_name: str

class RequirementCreate(BaseModel):
    title: str
    description: str
    priority: str
    status: str
    assignee: str
    tags: Optional[List[str]] = []

class RequirementUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assignee: Optional[str] = None
    tags: Optional[List[str]] = None

# ---- Auth helpers ----
def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username not in USERS_DB:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return USERS_DB[username]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_admin(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ---- Routes (NO /api prefix — root_path handles it) ----
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/auth/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = USERS_DB.get(form.username)
    if not user or not pwd_context.verify(form.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token({"sub": user["username"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "role": user["role"], "full_name": user["full_name"]}

@app.get("/me")
def me(user=Depends(get_current_user)):
    return {"username": user["username"], "full_name": user["full_name"], "role": user["role"]}

@app.get("/requirements")
def list_requirements(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    user=Depends(get_current_user)
):
    items = REQUIREMENTS[:]
    if status:   items = [r for r in items if r["status"] == status]
    if priority: items = [r for r in items if r["priority"] == priority]
    if search:
        q = search.lower()
        items = [r for r in items if q in r["title"].lower() or q in r["description"].lower()]
    return {"items": items, "total": len(items)}

@app.get("/requirements/{req_id}")
def get_requirement(req_id: str, user=Depends(get_current_user)):
    req = next((r for r in REQUIREMENTS if r["id"] == req_id), None)
    if not req: raise HTTPException(status_code=404, detail="Not found")
    return req

@app.post("/requirements", status_code=201)
def create_requirement(body: RequirementCreate, user=Depends(require_admin)):
    req = {
        "id": f"req-{uuid.uuid4().hex[:6]}",
        "title": body.title, "description": body.description,
        "priority": body.priority, "status": body.status,
        "assignee": body.assignee, "tags": body.tags or [],
        "created_by": user["username"],
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    REQUIREMENTS.append(req)
    return req

@app.put("/requirements/{req_id}")
def update_requirement(req_id: str, body: RequirementUpdate, user=Depends(require_admin)):
    req = next((r for r in REQUIREMENTS if r["id"] == req_id), None)
    if not req: raise HTTPException(status_code=404, detail="Not found")
    for field, val in body.model_dump(exclude_none=True).items():
        req[field] = val
    req["updated_at"] = datetime.utcnow().isoformat()
    return req

@app.delete("/requirements/{req_id}", status_code=204)
def delete_requirement(req_id: str, user=Depends(require_admin)):
    global REQUIREMENTS
    before = len(REQUIREMENTS)
    REQUIREMENTS = [r for r in REQUIREMENTS if r["id"] != req_id]
    if len(REQUIREMENTS) == before:
        raise HTTPException(status_code=404, detail="Not found")

@app.get("/stats")
def get_stats(user=Depends(get_current_user)):
    total = len(REQUIREMENTS)
    by_status, by_priority = {}, {}
    for r in REQUIREMENTS:
        by_status[r["status"]]     = by_status.get(r["status"], 0) + 1
        by_priority[r["priority"]] = by_priority.get(r["priority"], 0) + 1
    done = by_status.get("Done", 0)
    return {
        "total": total,
        "by_status": by_status,
        "by_priority": by_priority,
        "completion_rate": round((done / total * 100) if total else 0, 1),
    }

# ---- Vercel ASGI handler ----
handler = Mangum(app, lifespan="off")
