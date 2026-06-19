# careerReboot SecureApply API

This backend hosts security-first features for the trusted career ecosystem.

## Phase 2 implemented: User Auth (Firebase + MongoDB)

### Flow

1. Frontend verifies phone OTP with Firebase.
2. Frontend sends `firebaseUID` and `phone` to backend.
3. Backend checks MongoDB for duplicate phone.
4. Backend creates user when phone does not exist.

### Endpoint

- `POST /api/auth/register-user`

Request body:

```json
{
	"firebaseUID": "abc123",
	"phone": "+919876543210"
}
```

### Local setup

1. Create `.env` from `.env.example`.
2. Install dependencies: `npm install` inside `backend`.
3. Start API: `npm run dev` inside `backend`.

### Duplicate account prevention

The user schema enforces uniqueness at the database level:

```ts
phone: {
	type: String,
	unique: true
}
```

## Planned modules

- `auth`: phone OTP verification and unique phone enforcement
- `company-verification`: phishing scoring and company trust decisions
- `resume`: upload, encryption key generation, secure access
- `matching`: resume-role-company suitability scoring

## Phase order

1. OTP + unique phone registration
2. Company verification with phishing score gate
3. Resume upload + encryption key lifecycle
4. Resume intelligence + recommendations
5. Verified company matching
