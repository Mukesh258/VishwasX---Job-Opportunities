import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["VishwasX"]
    
    # Find ALL users
    users = []
    async for user in db["users"].find({}):
        user["_id"] = str(user["_id"])
        users.append(user)
    
    with open("all_users.json", "w") as f:
        json.dump(users, f, indent=2, default=str)
    
    print(f"Found {len(users)} user(s)")
    for u in users:
        has_profile = "careerStage" in u
        print(f"  - {u.get('email', 'NO EMAIL')} | has careerStage: {has_profile} | firebaseUID: {u.get('firebaseUID', 'NONE')}")
    
    client.close()

asyncio.run(main())
