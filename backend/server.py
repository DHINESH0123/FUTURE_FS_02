from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ===== MODELS =====

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    image: str
    ram: str
    storage: str
    processor: str
    camera: str
    display: str
    battery: str
    amazonPrice: float
    amazonUrl: str
    flipkartPrice: float
    flipkartUrl: str
    rating: float
    bestStore: str
    specifications: dict
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    firebaseUid: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WishlistItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    productId: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    productId: str
    selectedStore: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PriceAlert(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    productId: str
    targetPrice: float
    email: EmailStr
    active: bool = True
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Analytics(BaseModel):
    model_config = ConfigDict(extra="ignore")
    totalProducts: int
    totalUsers: int
    totalWishlists: int
    totalCarts: int
    totalAlerts: int
    topBrands: List[dict]
    recentActivity: List[dict]

# ===== REQUEST MODELS =====

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    firebaseUid: str

class WishlistCreate(BaseModel):
    userId: str
    productId: str

class CartCreate(BaseModel):
    userId: str
    productId: str
    selectedStore: str

class PriceAlertCreate(BaseModel):
    userId: str
    productId: str
    targetPrice: float
    email: EmailStr

# ===== ROUTES =====

@api_router.get("/")
async def root():
    return {"message": "SMARTDEAL HUB API"}

# Products
@api_router.get("/products", response_model=List[Product])
async def get_products(
    brand: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    ram: Optional[str] = None,
    storage: Optional[str] = None,
    minRating: Optional[float] = None,
    search: Optional[str] = None
):
    query = {}
    if brand:
        query['brand'] = brand
    if ram:
        query['ram'] = ram
    if storage:
        query['storage'] = storage
    if minRating:
        query['rating'] = {'$gte': minRating}
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'brand': {'$regex': search, '$options': 'i'}}
        ]
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    
    # Filter by price
    if minPrice is not None or maxPrice is not None:
        filtered = []
        for p in products:
            best_price = min(p['amazonPrice'], p['flipkartPrice'])
            if minPrice is not None and best_price < minPrice:
                continue
            if maxPrice is not None and best_price > maxPrice:
                continue
            filtered.append(p)
        products = filtered
    
    for product in products:
        if isinstance(product['timestamp'], str):
            product['timestamp'] = datetime.fromisoformat(product['timestamp'])
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if isinstance(product['timestamp'], str):
        product['timestamp'] = datetime.fromisoformat(product['timestamp'])
    
    return product

# Users
@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    existing = await db.users.find_one({"firebaseUid": user.firebaseUid}, {"_id": 0})
    if existing:
        if isinstance(existing['timestamp'], str):
            existing['timestamp'] = datetime.fromisoformat(existing['timestamp'])
        return existing
    
    user_obj = User(**user.model_dump())
    doc = user_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.users.insert_one(doc)
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user['timestamp'], str):
        user['timestamp'] = datetime.fromisoformat(user['timestamp'])
    
    return user

# Wishlist
@api_router.get("/wishlist/{user_id}", response_model=List[WishlistItem])
async def get_wishlist(user_id: str):
    items = await db.wishlist.find({"userId": user_id}, {"_id": 0}).to_list(1000)
    for item in items:
        if isinstance(item['timestamp'], str):
            item['timestamp'] = datetime.fromisoformat(item['timestamp'])
    return items

@api_router.post("/wishlist", response_model=WishlistItem)
async def add_to_wishlist(item: WishlistCreate):
    existing = await db.wishlist.find_one({"userId": item.userId, "productId": item.productId})
    if existing:
        raise HTTPException(status_code=400, detail="Already in wishlist")
    
    wishlist_obj = WishlistItem(**item.model_dump())
    doc = wishlist_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.wishlist.insert_one(doc)
    return wishlist_obj

@api_router.delete("/wishlist/{user_id}/{product_id}")
async def remove_from_wishlist(user_id: str, product_id: str):
    result = await db.wishlist.delete_one({"userId": user_id, "productId": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found in wishlist")
    return {"message": "Removed from wishlist"}

# Cart
@api_router.get("/cart/{user_id}", response_model=List[CartItem])
async def get_cart(user_id: str):
    items = await db.cart.find({"userId": user_id}, {"_id": 0}).to_list(1000)
    for item in items:
        if isinstance(item['timestamp'], str):
            item['timestamp'] = datetime.fromisoformat(item['timestamp'])
    return items

@api_router.post("/cart", response_model=CartItem)
async def add_to_cart(item: CartCreate):
    existing = await db.cart.find_one({"userId": item.userId, "productId": item.productId})
    if existing:
        raise HTTPException(status_code=400, detail="Already in cart")
    
    cart_obj = CartItem(**item.model_dump())
    doc = cart_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.cart.insert_one(doc)
    return cart_obj

@api_router.delete("/cart/{user_id}/{product_id}")
async def remove_from_cart(user_id: str, product_id: str):
    result = await db.cart.delete_one({"userId": user_id, "productId": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    return {"message": "Removed from cart"}

# Price Alerts
@api_router.get("/price-alerts/{user_id}", response_model=List[PriceAlert])
async def get_price_alerts(user_id: str):
    alerts = await db.price_alerts.find({"userId": user_id}, {"_id": 0}).to_list(1000)
    for alert in alerts:
        if isinstance(alert['timestamp'], str):
            alert['timestamp'] = datetime.fromisoformat(alert['timestamp'])
    return alerts

@api_router.post("/price-alerts", response_model=PriceAlert)
async def create_price_alert(alert: PriceAlertCreate):
    alert_obj = PriceAlert(**alert.model_dump())
    doc = alert_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.price_alerts.insert_one(doc)
    return alert_obj

@api_router.delete("/price-alerts/{alert_id}")
async def delete_price_alert(alert_id: str):
    result = await db.price_alerts.delete_one({"id": alert_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted"}

# Admin Analytics
@api_router.get("/admin/analytics", response_model=Analytics)
async def get_analytics():
    total_products = await db.products.count_documents({})
    total_users = await db.users.count_documents({})
    total_wishlists = await db.wishlist.count_documents({})
    total_carts = await db.cart.count_documents({})
    total_alerts = await db.price_alerts.count_documents({})
    
    # Top brands
    products = await db.products.find({}, {"_id": 0, "brand": 1}).to_list(1000)
    brand_count = {}
    for p in products:
        brand = p.get('brand', 'Unknown')
        brand_count[brand] = brand_count.get(brand, 0) + 1
    
    top_brands = [{'brand': k, 'count': v} for k, v in sorted(brand_count.items(), key=lambda x: x[1], reverse=True)[:5]]
    
    # Recent activity
    recent_alerts = await db.price_alerts.find({}, {"_id": 0}).sort("timestamp", -1).limit(5).to_list(5)
    recent_activity = [{"type": "alert", "data": a} for a in recent_alerts]
    
    return Analytics(
        totalProducts=total_products,
        totalUsers=total_users,
        totalWishlists=total_wishlists,
        totalCarts=total_carts,
        totalAlerts=total_alerts,
        topBrands=top_brands,
        recentActivity=recent_activity
    )

# Seed initial products
@api_router.post("/admin/seed-products")
async def seed_products():
    existing_count = await db.products.count_documents({})
    if existing_count > 0:
        return {"message": f"Already have {existing_count} products"}
    
    mock_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Samsung Galaxy S24 Ultra 5G",
            "brand": "Samsung",
            "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
            "ram": "12GB",
            "storage": "256GB",
            "processor": "Snapdragon 8 Gen 3",
            "camera": "200MP + 50MP + 12MP + 10MP",
            "display": "6.8 inch Dynamic AMOLED 2X",
            "battery": "5000mAh",
            "amazonPrice": 129999.0,
            "amazonUrl": "https://amazon.in",
            "flipkartPrice": 124999.0,
            "flipkartUrl": "https://flipkart.com",
            "rating": 4.6,
            "bestStore": "Flipkart",
            "specifications": {"os": "Android 14", "5g": "Yes"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "iPhone 15 Pro Max",
            "brand": "Apple",
            "image": "https://images.unsplash.com/photo-1696446700182-d28e88c6190b?w=500",
            "ram": "8GB",
            "storage": "256GB",
            "processor": "A17 Pro",
            "camera": "48MP + 12MP + 12MP",
            "display": "6.7 inch Super Retina XDR",
            "battery": "4422mAh",
            "amazonPrice": 159900.0,
            "amazonUrl": "https://amazon.in",
            "flipkartPrice": 159900.0,
            "flipkartUrl": "https://flipkart.com",
            "rating": 4.7,
            "bestStore": "Amazon",
            "specifications": {"os": "iOS 17", "5g": "Yes"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "OnePlus 12",
            "brand": "OnePlus",
            "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
            "ram": "16GB",
            "storage": "512GB",
            "processor": "Snapdragon 8 Gen 3",
            "camera": "50MP + 64MP + 48MP",
            "display": "6.82 inch AMOLED",
            "battery": "5400mAh",
            "amazonPrice": 69999.0,
            "amazonUrl": "https://amazon.in",
            "flipkartPrice": 64999.0,
            "flipkartUrl": "https://flipkart.com",
            "rating": 4.5,
            "bestStore": "Flipkart",
            "specifications": {"os": "OxygenOS 14", "5g": "Yes"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Xiaomi 14 Pro",
            "brand": "Xiaomi",
            "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
            "ram": "12GB",
            "storage": "256GB",
            "processor": "Snapdragon 8 Gen 3",
            "camera": "50MP + 50MP + 50MP",
            "display": "6.73 inch AMOLED",
            "battery": "4880mAh",
            "amazonPrice": 79999.0,
            "amazonUrl": "https://amazon.in",
            "flipkartPrice": 76999.0,
            "flipkartUrl": "https://flipkart.com",
            "rating": 4.4,
            "bestStore": "Flipkart",
            "specifications": {"os": "MIUI 15", "5g": "Yes"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Google Pixel 8 Pro",
            "brand": "Google",
            "image": "https://images.unsplash.com/photo-1598618443855-232ee0f819f1?w=500",
            "ram": "12GB",
            "storage": "256GB",
            "processor": "Google Tensor G3",
            "camera": "50MP + 48MP + 48MP",
            "display": "6.7 inch LTPO OLED",
            "battery": "5050mAh",
            "amazonPrice": 106999.0,
            "amazonUrl": "https://amazon.in",
            "flipkartPrice": 109999.0,
            "flipkartUrl": "https://flipkart.com",
            "rating": 4.5,
            "bestStore": "Amazon",
            "specifications": {"os": "Android 14", "5g": "Yes"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Vivo X100 Pro",
            "brand": "Vivo",
            "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500",
            "ram": "16GB",
            "storage": "512GB",
            "processor": "MediaTek Dimensity 9300",
            "camera": "50MP + 50MP + 50MP",
            "display": "6.78 inch AMOLED",
            "battery": "5400mAh",
            "amazonPrice": 89999.0,
            "amazonUrl": "https://amazon.in",
            "flipkartPrice": 86999.0,
            "flipkartUrl": "https://flipkart.com",
            "rating": 4.3,
            "bestStore": "Flipkart",
            "specifications": {"os": "Funtouch OS 14", "5g": "Yes"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Realme GT 5 Pro",
            "brand": "Realme",
            "image": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500",
            "ram": "12GB",
            "storage": "256GB",
            "processor": "Snapdragon 8 Gen 3",
            "camera": "50MP + 50MP + 8MP",
            "display": "6.78 inch AMOLED",
            "battery": "5400mAh",
            "amazonPrice": 54999.0,
            "amazonUrl": "https://amazon.in",
            "flipkartPrice": 52999.0,
            "flipkartUrl": "https://flipkart.com",
            "rating": 4.4,
            "bestStore": "Flipkart",
            "specifications": {"os": "Realme UI 5", "5g": "Yes"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Oppo Find X7 Ultra",
            "brand": "Oppo",
            "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
            "ram": "16GB",
            "storage": "512GB",
            "processor": "Snapdragon 8 Gen 3",
            "camera": "50MP + 50MP + 50MP + 50MP",
            "display": "6.82 inch AMOLED",
            "battery": "5000mAh",
            "amazonPrice": 99999.0,
            "amazonUrl": "https://amazon.in",
            "flipkartPrice": 94999.0,
            "flipkartUrl": "https://flipkart.com",
            "rating": 4.5,
            "bestStore": "Flipkart",
            "specifications": {"os": "ColorOS 14", "5g": "Yes"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.products.insert_many(mock_products)
    return {"message": f"Seeded {len(mock_products)} products"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()