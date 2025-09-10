import json
from bson import ObjectId

# Load brands
with open('data/mongo_brands.json') as f:
    brands = json.load(f)

# Map old _id to new ObjectId
brand_id_map = {}
for brand in brands:
    new_id = str(ObjectId())
    brand_id_map[brand['_id']] = new_id
    brand['_id'] = {"$oid": new_id}

# Save updated brands
with open('data/mongo_brands_new.json', 'w') as f:
    json.dump(brands, f, indent=2)

# Update models
with open('data/mongo_models.json') as f:
    models = [json.loads(line) if line.strip() else None for line in f]

for model in models:
    if model and model['brand_id'] in brand_id_map:
        model['brand_id'] = {"$oid": brand_id_map[model['brand_id']]}

with open('data/mongo_models_new.json', 'w') as f:
    for model in models:
        if model:
            f.write(json.dumps(model) + '\n')